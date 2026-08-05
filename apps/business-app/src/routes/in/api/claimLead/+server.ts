import { db } from '$lib/server/db';
import { countryForSlug } from '$lib/server/resolveCountry';
import { json, type RequestHandler } from '@sveltejs/kit';
import { SessionManager } from '$lib/auth/business';
import { sendEmail } from '$lib/in/sendEmail';
import { mintBusinessTokenById, mintUserToken } from '$lib/server/magicLink';
import { checkLeadDataPolicy } from '$lib/compliance';
import type { ClaimRequestPayload } from '$lib/types/lead';
import { IN_LEAD_RETURNING } from '$lib/server/leads';
import {
	syncLeadToUnified,
	syncBusinessToUnified,
	syncAccountToUnified,
	syncInSplitTables
} from '$lib/server/unifiedSync';
import {
	branches,
	businesses1,
	inBusinessProfiles,
	leaddata,
	leaddataClaimrequests,
	projects
} from '@solar/db/schema';
import { and, count, eq, inArray, sql } from 'drizzle-orm';

// Allow time for the full claim pipeline including Brevo calls — the default
// limit kills the function mid-run and silently drops the notification emails
export const config = { maxDuration: 60 };

// Row shapes are inferred from the Drizzle schema; the claimed copy returned to
// the client keeps the legacy snake_case names via IN_LEAD_RETURNING.
type NewLeadRow = {
	[K in keyof typeof IN_LEAD_RETURNING]: (typeof IN_LEAD_RETURNING)[K]['_']['data'];
};

export const POST: RequestHandler = async ({ request, cookies }) => {

	try {
		// Validate session and authorization
		const sessionResult = SessionManager.validateSession(cookies);

		if (!sessionResult.success) {
			return json(
				{ success: false, error: 'Unauthorized - Please login' },
				{ status: 401 }
			);
		}

		// URLs no longer carry the country, so it comes from the acting
		// business. Writes below target that country's legacy tables.
		const country = await countryForSlug(sessionResult.session.businessSlug);
		if (!country) {
			return json({ success: false, error: 'Business not found' }, { status: 404 });
		}

		const { lead_id, business_id, confirm_branch_creation } = (await request.json()) as ClaimRequestPayload;

		if (!lead_id || !business_id) {
			return json(
				{ success: false, error: 'Lead ID and Business ID are required' },
				{ status: 400 }
			);
		}

		// Verify the logged-in business is claiming for themselves
		if (sessionResult.session.businessId !== business_id) {
			return json(
				{ success: false, error: 'Forbidden - You can only claim leads for your own business' },
				{ status: 403 }
			);
		}

		// Data-handling policy gate: require a valid acceptance within 90 days
		const compliance = await checkLeadDataPolicy(business_id, country);
		if (!compliance.compliant) {
			return json({ success: false, error: 'compliance_required' }, { status: 403 });
		}

		// Claim gate: businesses with 10+ claimed leads must meet requirements
		const gateBranchesRes = await db
			.select({ branchId: branches.branchId })
			.from(branches)
			.where(and(eq(branches.mainId, business_id), eq(branches.isactive, true)));
		const gateAllIds = [business_id, ...gateBranchesRes.map((r) => r.branchId)];

		const gateSlug = sessionResult.session.businessSlug;
		const [gateClaimedRes, gateStaleRes, gateProjectsRes, gateRecentRes, gateBizRes] = await Promise.all([
			db
				.select({ count: count() })
				.from(leaddata)
				.where(
					and(
						inArray(leaddata.businessId, gateAllIds),
						eq(leaddata.category, 2),
						eq(leaddata.isvisible, true)
					)
				),
			db
				.select({ count: count() })
				.from(leaddata)
				.where(
					and(
						inArray(leaddata.businessId, gateAllIds),
						eq(leaddata.category, 2),
						eq(leaddata.isvisible, true),
						eq(leaddata.stage, 0),
						eq(leaddata.status, true)
					)
				),
			db
				.select({ count: count() })
				.from(projects)
				.where(and(eq(projects.businessSlug, gateSlug), eq(projects.isvisible, true))),
			db
				.select({ count: count() })
				.from(projects)
				.where(
					and(
						eq(projects.businessSlug, gateSlug),
						eq(projects.isvisible, true),
						// `sql` escape hatch: interval arithmetic against NOW().
						sql`${projects.createdAt} > NOW() - INTERVAL '60 days'`
					)
				),
			db
				.select({
					description: inBusinessProfiles.description,
					brands: inBusinessProfiles.brands,
					googleMapsLink: inBusinessProfiles.googleMapsLink
				})
				.from(inBusinessProfiles)
				.where(eq(inBusinessProfiles.businessId, business_id))
		]);

		const gateTotalClaimed = gateClaimedRes[0]?.count ?? 0;
		if (gateTotalClaimed >= 10) {
			const gateStaleClaimed = gateStaleRes[0]?.count ?? 0;
			const gateProjectsCount = gateProjectsRes[0]?.count ?? 0;
			const gateRecentProject = (gateRecentRes[0]?.count ?? 0) > 0;
			const biz = gateBizRes[0];
			const gateProfileComplete = !!biz?.description
				&& Array.isArray(biz?.brands) && biz.brands.length > 0
				&& !!biz?.googleMapsLink;
			const gateStalePercent = gateTotalClaimed > 0 ? (gateStaleClaimed / gateTotalClaimed) * 100 : 0;

			const blocked = gateStalePercent > 50 || gateProjectsCount < 6 || !gateRecentProject || !gateProfileComplete;
			if (blocked) {
				return json(
					{ success: false, error: 'Claiming paused — update your leads, post projects, and complete your profile to resume' },
					{ status: 403 }
				);
			}
		}

		// Email inputs captured during the transaction, sent after commit
		let allotmentBusinessId: number | null = null;
		let customerBusinessId: number | null = null;
		let customer: { name: string; email: string | null } | null = null;
		let newLead: NewLeadRow | null = null;
		// Set by the branches that used to ROLLBACK and return a specific
		// response; tx.rollback() throws, so the response is carried out here.
		let earlyExit: { status: number; body: Record<string, unknown> } | null = null;

		try {
			await db.transaction(async (tx) => {
				// Lock the row to prevent race conditions & fetch claim count
				const claimCountResult = await tx
					.select({ claimCount: leaddata.claimCount })
					.from(leaddata)
					.where(eq(leaddata.id, lead_id))
					.for('update');

				if (claimCountResult.length === 0) {
					throw new Error('Lead not found');
				}

				const claim_id = claimCountResult[0].claimCount ?? 0;

				// **Check if lead can still be claimed (Max = 5 claims)**
				if (claim_id >= 5) {
					earlyExit = {
						status: 400,
						body: { success: false, error: 'Maximum claim limit reached for this lead' }
					};
					tx.rollback();
				}

				// **Check if this business already claimed this lead (duplicate prevention)**
				const duplicateCheck = await tx
					.select({ id: leaddataClaimrequests.id })
					.from(leaddataClaimrequests)
					.where(
						and(
							eq(leaddataClaimrequests.leadId, lead_id),
							eq(leaddataClaimrequests.businessId, business_id)
						)
					);

				if (duplicateCheck.length > 0) {
					earlyExit = {
						status: 400,
						body: { success: false, error: 'You have already claimed this lead' }
					};
					tx.rollback();
				}

				// Determine effective business_id — auto-create branch if no presence in lead's district
				let effectiveBusinessId = business_id;
				let mainBusinessId = business_id;

				const leadLocationResult = await tx
					.select({ district: leaddata.district, state: leaddata.state })
					.from(leaddata)
					.where(eq(leaddata.id, lead_id));
				const leadDistrict = leadLocationResult[0]?.district ?? null;
				const leadState = leadLocationResult[0]?.state ?? null;

				if (leadDistrict) {
					// Resolve main business ID (in case business_id belongs to a branch)
					const parentResult = await tx
						.select({ mainId: branches.mainId })
						.from(branches)
						.where(and(eq(branches.branchId, business_id), eq(branches.isactive, true)))
						.limit(1);
					mainBusinessId = parentResult.length > 0 ? parentResult[0].mainId : business_id;

					// Check if main or any branch already serves the lead's district
					const presenceResult = await tx
						.select({ id: inBusinessProfiles.businessId })
						.from(inBusinessProfiles)
						.where(
							and(
								// district is not id-scoped, so without the country filter a US
								// lead's district could match an IN business's and suppress the
								// branch creation. Every other lookup here is by a globally
								// unique id, which is why this is the only one that needs it.
								eq(inBusinessProfiles.countryCode, country),
								eq(inBusinessProfiles.district, leadDistrict),
								sql`(${inBusinessProfiles.businessId} = ${mainBusinessId} OR EXISTS (
								     SELECT 1 FROM ${branches} WHERE ${branches.mainId} = ${mainBusinessId}
								     AND ${branches.branchId} = ${inBusinessProfiles.businessId}
								     AND ${branches.isactive} = true
								 ))`
							)
						)
						.limit(1);

					if (presenceResult.length === 0) {
						if (!confirm_branch_creation) {
							earlyExit = {
								status: 200,
								body: { success: false, needsBranchConfirmation: true, district: leadDistrict }
							};
							tx.rollback();
						}

						// Confirmed — create a branch in the lead's district
						const mainResult = await tx
							.select({
								slug: businesses1.slug,
								businessname: businesses1.businessname,
								phonenumber: businesses1.phonenumber,
								email: businesses1.email,
								loginEmail: businesses1.loginEmail,
								loginPassword: businesses1.loginPassword,
								address: businesses1.address,
								website: businesses1.website,
								rscore: businesses1.rscore,
								isvisible: businesses1.isvisible,
								pluscode: businesses1.pluscode,
								gstn: businesses1.gstn,
								tag: businesses1.tag,
								services: businesses1.services,
								description: businesses1.description
							})
							.from(businesses1)
							.where(eq(businesses1.id, mainBusinessId));
						const main = mainResult[0];
						const branchSlug = `${main.slug}-branch-${Math.random().toString(16).slice(2, 8)}`;

						// `city` took the same parameter as `district` in the raw INSERT ($11).
						const newBranchResult = await tx
							.insert(businesses1)
							.values({
								countryCode: country,
								rscore: main.rscore,
								isvisible: main.isvisible,
								pluscode: main.pluscode,
								phonenumber: main.phonenumber,
								email: main.email,
								loginEmail: main.loginEmail,
								loginPassword: main.loginPassword,
								website: main.website,
								gstn: main.gstn,
								state: leadState,
								district: leadDistrict,
								tag: main.tag,
								slug: branchSlug,
								city: leadDistrict,
								businessname: main.businessname,
								address: main.address,
								services: main.services,
								description: main.description ?? 'Solar panel installer'
							})
							.returning({ id: businesses1.id });
						const newBranchId = newBranchResult[0].id;

						await tx
							.insert(branches)
							.values({ mainId: mainBusinessId, branchId: newBranchId, isactive: true });

						effectiveBusinessId = newBranchId;
					} else {
						effectiveBusinessId = presenceResult[0].id;
					}
				}

				// Insert into leaddata_claimrequests
				// Note: UNIQUE constraint on (lead_id, business_id) provides additional protection
				const insertResult = await tx
					.insert(leaddataClaimrequests)
					.values({ leadId: lead_id, claimId: claim_id, businessId: effectiveBusinessId })
					.returning({ id: leaddataClaimrequests.id })
					.catch((error: Error & { code?: string }) => {
						// Handle unique constraint violation (PostgreSQL error code 23505)
						if (error.code === '23505') {
							throw new Error('You have already claimed this lead');
						}
						throw error;
					});

				const claimRequestId = insertResult[0].id;

				// Increment claim_count in leaddata
				await tx
					.update(leaddata)
					.set({ claimCount: sql`${leaddata.claimCount} + 1` })
					.where(eq(leaddata.id, lead_id));

				// Auto-allocate ALL successful claims (within 5-claim limit)
				// Since we passed the claim limit check, auto-allocate this claim

				// Set this claim as allotted
				await tx
					.update(leaddataClaimrequests)
					.set({ isallotted: true, isresolved: true })
					.where(eq(leaddataClaimrequests.id, claimRequestId));

				// Fetch original lead data to create allocated lead
				const leadDataResult = await tx.select().from(leaddata).where(eq(leaddata.id, lead_id));

				if (leadDataResult.length > 0) {
					const originalLead = leadDataResult[0];
					customer = { name: originalLead.name, email: originalLead.email };

					// Create new lead entry for the allocated business
					const newLeadResult = await tx
						.insert(leaddata)
						.values({
							countryCode: country,
							name: originalLead.name,
							phone: originalLead.phone,
							email: originalLead.email,
							pinCode: originalLead.pinCode,
							type: originalLead.type,
							comment: originalLead.comment,
							// `sql` escape hatch: NOW() for created_at, as the raw INSERT had.
							createdAt: sql`NOW()`,
							svnotes: originalLead.svnotes,
							svCommentForBusinesses: originalLead.svCommentForBusinesses,
							urlparams: originalLead.urlparams,
							isvisible: true,
							category: 2,
							district: originalLead.district,
							stage: 0,
							status: true,
							claimCount: 0,
							originalId: originalLead.id, // Set original_id to the original lead's ID
							businessId: effectiveBusinessId // the branch serving the lead's district
						})
						.returning(IN_LEAD_RETURNING);
					newLead = newLeadResult[0] ?? null;
				}

				// Prepare email data but don't send yet (move outside transaction)
				allotmentBusinessId = mainBusinessId;
				customerBusinessId = effectiveBusinessId;

			// Project the rows written above into the unified tables (covers the
			// auto-created branch, the claim-count bump and the claimed copy).
				await syncInSplitTables(tx, effectiveBusinessId);
				await syncBusinessToUnified(tx, country, effectiveBusinessId);
				await syncAccountToUnified(tx, country, effectiveBusinessId);
				await syncLeadToUnified(tx, country, lead_id);
				if (newLead) {
					await syncLeadToUnified(tx, country, newLead.id);
				}
			});
		} catch (error) {
			// tx.rollback() throws, so the deliberate early exits land here first.
			if (earlyExit) {
				return json(earlyExit.body, { status: earlyExit.status });
			}
			console.error('❌ Error claiming lead:', error);
			const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
			return json({ success: false, error: errorMessage }, { status: 500 });
		}

		// Send emails AFTER transaction commits, directly and in parallel —
		// internal fetch hops added latency and hid Brevo failures
		const adminEmail = 'admin@solarvipani.com';

		const sendAllotmentEmail = async () => {
			if (!allotmentBusinessId) return;
			try {
				const bizResult = await db
					.select({
						businessname: businesses1.businessname,
						loginEmail: businesses1.loginEmail,
						slug: businesses1.slug
					})
					.from(businesses1)
					.where(eq(businesses1.id, allotmentBusinessId))
					.limit(1);
				if (bizResult.length === 0) {
					console.error('❌ Allotment email skipped: business not found', allotmentBusinessId);
					return;
				}
				const { businessname, loginEmail, slug } = bizResult[0];
				// Mint a fresh token (stored hashed); email the raw token.
				const rawToken = await mintBusinessTokenById(country, allotmentBusinessId);
				const magicLink = `https://business.solarvipani.com/in/${slug}/signin-link/${rawToken}`;

				const subject = 'New Lead Allotted - Solar Vipani';
				const message = `
    <p>Dear ${businessname},</p>
    <p>Great news! A new lead has been successfully allotted to your business.</p>
    <p>You can view the lead details by logging into your Solar Vipani business account.</p>

    <p style="margin-bottom: 2rem;">
        <a href="${magicLink}" style="color: blue; text-decoration: underline;">Access Your Business Account</a>
    </p>

    <p>If you have any questions, feel free to contact us at <a href="tel:+918983066701">+91 8983066701</a>.</p>
    <p>Best Regards,</p>
    <p><strong>Solar Vipani Team</strong></p>

    <hr style="margin: 2rem 0; border: none; border-top: 1px solid #e0e0e0;" />
    <p style="font-size: 0.9rem; color: #555;">
        Looking for a digital marketing agency to run ads on Facebook, Instagram and Google?
        Check out <a href="https://qualityclickss.com/" style="color: blue; text-decoration: underline;">Quality Clickss</a>.
    </p>
    `;

				const result = await sendEmail([loginEmail, adminEmail], subject, message, { isHtml: true });
				if (!result.success) {
					console.error('❌ Failed to send lead allotment email:', result.error);
				}
			} catch (emailError) {
				console.error('❌ Error sending lead allotment email:', emailError);
			}
		};

		const sendCustomerEmail = async () => {
			if (!customerBusinessId || !customer?.email) return;
			try {
				const bizResult = await db
					.select({
						businessname: inBusinessProfiles.businessname,
						phonenumber: inBusinessProfiles.phonenumber,
						email: inBusinessProfiles.email,
						slug: inBusinessProfiles.slug
					})
					.from(inBusinessProfiles)
					.where(eq(inBusinessProfiles.businessId, customerBusinessId));
				if (bizResult.length === 0) {
					console.error('❌ Customer email skipped: business not found', customerBusinessId);
					return;
				}
				const business = bizResult[0];
				// Cross-app link into main-app, which still carries a [country]
				// segment — so this one takes the *resolved* country, not a literal.
				// Hardcoding /in/ here would send every US customer to an India
				// profile URL. (/us/solar-panel-installer/[slug] is only a legacy
				// redirect to this canonical form; see main-app hooks.server.ts.)
				const profileLink = `https://solarvipani.com/${country}/installer/${business.slug}`;

				// Mint a fresh user token (stored hashed, upserts the in_user row);
				// email the raw token.
				const magicLinkToken = await mintUserToken(customer.email, customer.name || null);
				const customerAccountLink = `https://user.solarvipani.com/signin-link/${magicLinkToken}`;

				const subject = 'A Solar Installer is Interested in Your Inquiry - Solar Vipani';
				const message = `
    <p>Dear ${customer.name},</p>
    <p>Great news! A verified solar installer has shown interest in your inquiry on Solar Vipani.</p>
    <p><strong>Installer Details:</strong></p>
    <ul>
        <li><strong>Name:</strong> ${business.businessname}</li>
        <li><strong>Phone:</strong> ${business.phonenumber || 'N/A'}</li>
        <li><strong>Email:</strong> ${business.email || 'N/A'}</li>
        <li><strong>View Profile:</strong> <a href="${profileLink}" style="color: #0056b3;">${business.businessname}</a></li>
    </ul>
    <p>One of our verified installers will reach out to you shortly to discuss your solar energy needs.</p>
    <p style="margin-top: 20px;"><strong>Track your inquiry:</strong></p>
    <p><a href="${customerAccountLink}" style="display: inline-block; padding: 10px 20px; background-color: #0056b3; color: #ffffff; text-decoration: none; border-radius: 5px;">View Your Account</a></p>
    <p style="font-size: 12px; color: #666;">This link is unique to you and gives you access to your Solar Vipani customer account.</p>
    <p>If you have any questions, feel free to contact us at <a href="mailto:admin@solarvipani.com">admin@solarvipani.com</a>.</p>
    <p>Best Regards,<br><strong>Solar Vipani Team</strong></p>
    `;

				const result = await sendEmail([customer.email, adminEmail], subject, message, { isHtml: true });
				if (!result.success) {
					console.error('❌ Failed to send customer claim notification:', result.error);
				}
			} catch (emailError) {
				console.error('❌ Error sending customer claim notification:', emailError);
			}
		};

		await Promise.all([sendAllotmentEmail(), sendCustomerEmail()]);

		return json({ success: true, newLead });
	} catch (error) {
		console.error('❌ Database connection error:', error);
		return json(
			{ success: false, error: 'Failed to claim lead' },
			{ status: 500 }
		);
	}
};
