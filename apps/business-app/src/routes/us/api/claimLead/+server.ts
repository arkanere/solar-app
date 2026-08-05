import { db } from '$lib/server/db';
import { json, type RequestHandler } from '@sveltejs/kit';
import { BusinessAuthService } from '$lib/us/auth/business';
import { sendEmail } from '$lib/us/sendEmail';
import { mintBusinessTokenById } from '$lib/server/magicLink';
import { checkLeadDataPolicy } from '$lib/compliance';
import type { ClaimRequestPayload } from '$lib/types/lead';
import { syncLeadToUnified } from '$lib/server/unifiedSync';
import {
	businessAccounts,
	businesses,
	usLeaddata,
	usLeaddataClaimrequests
} from '@solar/db/schema';
import { and, eq, sql } from 'drizzle-orm';

interface EmailData {
	business_id: number;
	isallotted: boolean;
}

export const POST: RequestHandler = async ({ request, cookies }) => {

	try {
		// Validate session and authorization
		const authService = new BusinessAuthService();
		const sessionResult = authService.validateSession(cookies);

		if (!sessionResult.success) {
			return json(
				{ success: false, error: 'Unauthorized - Please login' },
				{ status: 401 }
			);
		}

		const { lead_id, business_id } = (await request.json()) as ClaimRequestPayload;

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
		const compliance = await checkLeadDataPolicy(business_id, 'us');
		if (!compliance.compliant) {
			return json({ success: false, error: 'compliance_required' }, { status: 403 });
		}

		let emailData: EmailData | null = null; // Store email data to send after transaction
		let customerEmailData: { lead_id: number; business_id: number } | null = null;
		// Set by the branches that used to ROLLBACK and return a specific
		// response; tx.rollback() throws, so the response is carried out here.
		let earlyExit: { status: number; body: Record<string, unknown> } | null = null;

		try {
			await db.transaction(async (tx) => {
				// Lock the row to prevent race conditions & fetch claim count
				const claimCountResult = await tx
					.select({ claimCount: usLeaddata.claimCount })
					.from(usLeaddata)
					.where(eq(usLeaddata.id, lead_id))
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
					.select({ id: usLeaddataClaimrequests.id })
					.from(usLeaddataClaimrequests)
					.where(
						and(
							eq(usLeaddataClaimrequests.leadId, lead_id),
							eq(usLeaddataClaimrequests.businessId, business_id)
						)
					);

				if (duplicateCheck.length > 0) {
					earlyExit = {
						status: 400,
						body: { success: false, error: 'You have already claimed this lead' }
					};
					tx.rollback();
				}

				// Insert into us_leaddata_claimrequests
				// Note: UNIQUE constraint on (lead_id, business_id) provides additional protection
				const insertResult = await tx
					.insert(usLeaddataClaimrequests)
					.values({ leadId: lead_id, claimId: claim_id, businessId: business_id })
					.returning({ id: usLeaddataClaimrequests.id })
					.catch((error: Error & { code?: string }) => {
						// Handle unique constraint violation (PostgreSQL error code 23505)
						if (error.code === '23505') {
							throw new Error('You have already claimed this lead');
						}
						throw error;
					});

				const claimRequestId = insertResult[0].id;

				// Increment claim_count in us_leaddata
				await tx
					.update(usLeaddata)
					.set({ claimCount: sql`${usLeaddata.claimCount} + 1` })
					.where(eq(usLeaddata.id, lead_id));

				// Auto-allocate ALL successful claims (within 5-claim limit)
				// Since we passed the claim limit check, auto-allocate this claim

				// Set this claim as allotted
				await tx
					.update(usLeaddataClaimrequests)
					.set({ isallotted: true, isresolved: true })
					.where(eq(usLeaddataClaimrequests.id, claimRequestId));

				// Fetch original lead data to create allocated lead
				const leadDataResult = await tx
					.select()
					.from(usLeaddata)
					.where(eq(usLeaddata.id, lead_id));

				if (leadDataResult.length > 0) {
					const originalLead = leadDataResult[0];

					// Create new lead entry for the allocated business
					const newLeadResult = await tx
						.insert(usLeaddata)
						.values({
							name: originalLead.name,
							phone: originalLead.phone,
							email: originalLead.email,
							zipcode: originalLead.zipcode,
							type: originalLead.type,
							comment: originalLead.comment,
							// `sql` escape hatch: NOW() for created_at, as the raw INSERT had.
							createdAt: sql`NOW()`,
							svnotes: originalLead.svnotes,
							svCommentForBusinesses: originalLead.svCommentForBusinesses,
							urlparams: originalLead.urlparams,
							isvisible: true,
							category: 2,
							county: originalLead.county,
							stage: 0,
							status: true,
							claimCount: 0,
							originalId: originalLead.id, // Set original_id to the original lead's ID
							businessId: business_id // Set business_id from claim request
						})
						.returning({ id: usLeaddata.id });
					if (newLeadResult[0]) {
						await syncLeadToUnified(tx, 'us', newLeadResult[0].id);
					}
				}

				await syncLeadToUnified(tx, 'us', lead_id);

				// Prepare email data but don't send yet (move outside transaction)
				emailData = { business_id, isallotted: true };
				customerEmailData = { lead_id, business_id };
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

		// Send email AFTER transaction commits (outside transaction for better performance)
		if (emailData) {
			try {
				// Reads the country-agnostic unified tables, keyed the way every
				// other unified read is: (country_code, source_id). `businesses`
				// carries the profile, `business_accounts` the login email — the
				// same join TokenManager uses. This previously read businesses_1
				// (the IN table) for a /us id and always came back empty.
				const bizResult = await db
					.select({
						businessname: businesses.businessname,
						loginEmail: businessAccounts.loginEmail,
						slug: businesses.slug
					})
					.from(businesses)
					.innerJoin(
						businessAccounts,
						and(
							eq(businessAccounts.countryCode, businesses.countryCode),
							eq(businessAccounts.sourceId, businesses.sourceId)
						)
					)
					.where(
						and(
							eq(businesses.countryCode, 'us'),
							eq(businesses.sourceId, emailData.business_id)
						)
					)
					.limit(1);

				if (bizResult.length === 0) {
					console.error('❌ Allotment email skipped: business not found', emailData.business_id);
				} else {
					const { businessname, loginEmail, slug } = bizResult[0];
					const adminEmail = 'admin@solarvipani.com';
					// Mint a fresh token (stored hashed); email the raw token.
					// The token WRITE stays on the per-country legacy table: that is
					// the write side, and mintBusinessTokenById projects it into
					// business_accounts itself. Only the table argument was wrong.
					const rawToken = await mintBusinessTokenById('us_businesses', emailData.business_id);
					const magicLink = `https://business.solarvipani.com/us/${slug}/signin-link/${rawToken}`;

					const subject = 'New Lead Allotted - Solar Vipani';
					const message = `
    <p>Dear ${businessname},</p>
    <p>Great news! A new lead has been successfully allotted to your business.</p>
    <p>You can view the lead details by logging into your Solar Vipani business account.</p>

    <p style="margin-bottom: 2rem;">
        <a href="${magicLink}" style="color: blue; text-decoration: underline;">Access Your Business Account</a>
    </p>

    <p>Best Regards,</p>
    <p><strong>Solar Vipani Team</strong></p>

    <hr style="margin: 2rem 0; border: none; border-top: 1px solid #e0e0e0;" />
    <p style="font-size: 0.9rem; color: #555;">
        Looking for a digital marketing agency to run ads on Facebook, Instagram and Google?
        Check out <a href="https://qualityclickss.com/" style="color: blue; text-decoration: underline;">Quality Clickss</a>.
    </p>
    `;

					const result = await sendEmail([loginEmail, adminEmail], subject, message, {
						isHtml: true
					});
					if (!result.success) {
						console.error('❌ Failed to send lead allotment email:', result.error);
					}
				}
			} catch (emailError) {
				console.error('❌ Error sending lead allotment email:', emailError);
			}
		}

		if (customerEmailData) {
			try {
				const leadResult = await db
					.select({ name: usLeaddata.name, email: usLeaddata.email })
					.from(usLeaddata)
					.where(eq(usLeaddata.id, customerEmailData.lead_id));
				const lead = leadResult[0];

				if (!lead?.email) {
					// No customer email on file — nothing to notify
				} else {
					// Unified `businesses`, same keying as the allotment lookup above.
					// No account join here — the customer mail shows only public
					// contact details.
					const bizResult = await db
						.select({
							businessname: businesses.businessname,
							phonenumber: businesses.phonenumber,
							email: businesses.email,
							slug: businesses.slug
						})
						.from(businesses)
						.where(
							and(
								eq(businesses.countryCode, 'us'),
								eq(businesses.sourceId, customerEmailData.business_id)
							)
						);

					if (bizResult.length === 0) {
						console.error(
							'❌ Customer notification skipped: business not found',
							customerEmailData.business_id
						);
					} else {
						const business = bizResult[0];
						const profileLink = `https://solarvipani.com/us/solar-panel-installer/${business.slug}`;
						const adminEmail = 'admin@solarvipani.com';

						const subject = 'A Solar Installer is Interested in Your Inquiry - Solar Vipani';
						const message = `
    <p>Dear ${lead.name},</p>
    <p>Great news! A verified solar installer has shown interest in your inquiry on Solar Vipani.</p>
    <p><strong>Installer Details:</strong></p>
    <ul>
        <li><strong>Name:</strong> ${business.businessname}</li>
        <li><strong>Phone:</strong> ${business.phonenumber || 'N/A'}</li>
        <li><strong>Email:</strong> ${business.email || 'N/A'}</li>
        <li><strong>View Profile:</strong> <a href="${profileLink}" style="color: #0056b3;">${business.businessname}</a></li>
    </ul>
    <p>One of our verified installers will reach out to you shortly to discuss your solar energy needs.</p>
    <p>If you have any questions, feel free to contact us at <a href="mailto:admin@solarvipani.com">admin@solarvipani.com</a>.</p>
    <p>Best Regards,<br><strong>Solar Vipani Team</strong></p>
    `;

						const result = await sendEmail([lead.email, adminEmail], subject, message, {
							isHtml: true
						});
						if (!result.success) {
							console.error('❌ Failed to send customer claim notification:', result.error);
						}
					}
				}
			} catch (emailError) {
				console.error('❌ Error sending customer claim notification:', emailError);
			}
		}

		return json({ success: true });
	} catch (error) {
		console.error('❌ Database connection error:', error);
		return json(
			{ success: false, error: 'Failed to claim lead' },
			{ status: 500 }
		);
	}
};
