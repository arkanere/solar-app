import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { json, type RequestHandler } from '@sveltejs/kit';
import { BusinessAuthService } from '$lib/in/auth/business';
import { sendEmail } from '$lib/in/sendEmail';
import { mintBusinessTokenById, mintUserToken } from '$lib/server/magicLink';
import { checkLeadDataPolicy } from '$lib/compliance';
import type { ClaimRequestPayload } from '$lib/types/lead';
import {
	syncLeadToUnified,
	syncBusinessToUnified,
	syncAccountToUnified,
	syncInSplitTables
} from '$lib/server/unifiedSync';

// Allow time for the full claim pipeline including Brevo calls — the default
// limit kills the function mid-run and silently drops the notification emails
export const config = { maxDuration: 60 };

interface ClaimCountRow {
	claim_count: number;
}

interface ClaimRequestRow {
	id: number;
}

interface NewLeadRow {
	id: number;
	name: string;
	phone: string;
	email: string | null;
	pin_code: string;
	district: string | null;
	type: string | null;
	comment: string | null;
	created_at: string;
	svnotes: string | null;
	sv_comment_for_businesses: string | null;
	urlparams: string | null;
	isvisible: boolean;
	category: number;
	stage: number;
	status: boolean;
	claim_count: number;
	original_id: number | null;
	business_id: number | null;
	business_notes: string | null;
}

interface LeadDataRow {
	id: number;
	name: string;
	phone: string;
	email: string | null;
	pin_code: string;
	type: string | null;
	comment: string | null;
	svnotes: string | null;
	sv_comment_for_businesses: string | null;
	urlparams: string | null;
	district: string | null;
	state: string | null;
}

export const POST: RequestHandler = async ({ request, cookies }) => {
	const pool = createPool({ connectionString: POSTGRES_URL });

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
		const compliance = await checkLeadDataPolicy(pool, business_id);
		if (!compliance.compliant) {
			return json({ success: false, error: 'compliance_required' }, { status: 403 });
		}

		// Claim gate: businesses with 10+ claimed leads must meet requirements
		const gateBranchesRes = await pool.query(
			`SELECT branch_id FROM branches WHERE main_id = $1 AND isactive = true`,
			[business_id]
		);
		const gateAllIds = [business_id, ...gateBranchesRes.rows.map((r: { branch_id: number }) => r.branch_id)];

		const [gateClaimedRes, gateStaleRes, gateProjectsRes, gateRecentRes, gateBizRes] = await Promise.all([
			pool.query(
				`SELECT COUNT(*) as count FROM leaddata WHERE business_id = ANY($1) AND category = 2 AND isvisible = true`,
				[gateAllIds]
			),
			pool.query(
				`SELECT COUNT(*) as count FROM leaddata WHERE business_id = ANY($1) AND category = 2 AND isvisible = true AND stage = 0 AND status = true`,
				[gateAllIds]
			),
			pool.query(
				`SELECT COUNT(*) as count FROM projects WHERE business_slug = $1 AND isvisible = true`,
				[sessionResult.session.businessSlug]
			),
			pool.query(
				`SELECT COUNT(*) as count FROM projects WHERE business_slug = $1 AND isvisible = true AND created_at > NOW() - INTERVAL '60 days'`,
				[sessionResult.session.businessSlug]
			),
			pool.query(
				`SELECT description, brands, google_maps_link FROM in_business_profiles WHERE business_id = $1`,
				[business_id]
			)
		]);

		const gateTotalClaimed = parseInt(gateClaimedRes.rows[0]?.count || '0');
		if (gateTotalClaimed >= 10) {
			const gateStaleClaimed = parseInt(gateStaleRes.rows[0]?.count || '0');
			const gateProjectsCount = parseInt(gateProjectsRes.rows[0]?.count || '0');
			const gateRecentProject = parseInt(gateRecentRes.rows[0]?.count || '0') > 0;
			const biz = gateBizRes.rows[0];
			const gateProfileComplete = !!biz?.description
				&& Array.isArray(biz?.brands) && biz.brands.length > 0
				&& !!biz?.google_maps_link;
			const gateStalePercent = gateTotalClaimed > 0 ? (gateStaleClaimed / gateTotalClaimed) * 100 : 0;

			const blocked = gateStalePercent > 50 || gateProjectsCount < 6 || !gateRecentProject || !gateProfileComplete;
			if (blocked) {
				return json(
					{ success: false, error: 'Claiming paused — update your leads, post projects, and complete your profile to resume' },
					{ status: 403 }
				);
			}
		}

		// Start a transaction
		const client = await pool.connect();
		// Email inputs captured during the transaction, sent after commit
		let allotmentBusinessId: number | null = null;
		let customerBusinessId: number | null = null;
		let customer: { name: string; email: string | null } | null = null;
		let newLead: NewLeadRow | null = null;

		try {
			await client.query('BEGIN');

			// Lock the row to prevent race conditions & fetch claim count
			const claimCountResult = await client.query<ClaimCountRow>(
				'SELECT claim_count FROM leaddata WHERE id = $1 FOR UPDATE',
				[lead_id]
			);

			if (claimCountResult.rows.length === 0) {
				throw new Error('Lead not found');
			}

			const claim_id = claimCountResult.rows[0].claim_count;

			// **Check if lead can still be claimed (Max = 5 claims)**
			if (claim_id >= 5) {
				await client.query('ROLLBACK');
				return json(
					{ success: false, error: 'Maximum claim limit reached for this lead' },
					{ status: 400 }
				);
			}

			// **Check if this business already claimed this lead (duplicate prevention)**
			const duplicateCheck = await client.query<ClaimRequestRow>(
				'SELECT id FROM leaddata_claimrequests WHERE lead_id = $1 AND business_id = $2',
				[lead_id, business_id]
			);

			if (duplicateCheck.rows.length > 0) {
				await client.query('ROLLBACK');
				return json(
					{ success: false, error: 'You have already claimed this lead' },
					{ status: 400 }
				);
			}

			// Determine effective business_id — auto-create branch if no presence in lead's district
			let effectiveBusinessId = business_id;
			let mainBusinessId = business_id;

			const leadLocationResult = await client.query<{ district: string | null; state: string | null }>(
				'SELECT district, state FROM leaddata WHERE id = $1',
				[lead_id]
			);
			const leadDistrict = leadLocationResult.rows[0]?.district ?? null;
			const leadState = leadLocationResult.rows[0]?.state ?? null;

			if (leadDistrict) {
				// Resolve main business ID (in case business_id belongs to a branch)
				const parentResult = await client.query<{ main_id: number }>(
					'SELECT main_id FROM branches WHERE branch_id = $1 AND isactive = true LIMIT 1',
					[business_id]
				);
				mainBusinessId =
					parentResult.rows.length > 0 ? parentResult.rows[0].main_id : business_id;

				// Check if main or any branch already serves the lead's district
				const presenceResult = await client.query<{ id: number }>(
					`SELECT b.business_id AS id FROM in_business_profiles b
					 WHERE b.district = $1
					 AND (b.business_id = $2 OR EXISTS (
					     SELECT 1 FROM branches WHERE main_id = $2 AND branch_id = b.business_id AND isactive = true
					 ))
					 LIMIT 1`,
					[leadDistrict, mainBusinessId]
				);

				if (presenceResult.rows.length === 0) {
					if (!confirm_branch_creation) {
						await client.query('ROLLBACK');
						return json({ success: false, needsBranchConfirmation: true, district: leadDistrict });
					}

					// Confirmed — create a branch in the lead's district
					const mainResult = await client.query<{
						slug: string;
						businessname: string;
						phonenumber: string | null;
						email: string | null;
						login_email: string;
						login_password: string;
						address: string | null;
						website: string | null;
						rscore: number | null;
						isvisible: boolean | null;
						pluscode: string | null;
						gstn: string | null;
						tag: string | null;
						services: string[] | null;
						description: string | null;
					}>('SELECT slug, businessname, phonenumber, email, login_email, login_password, address, website, rscore, isvisible, pluscode, gstn, tag, services, description FROM businesses_1 WHERE id = $1', [
						mainBusinessId
					]);
					const main = mainResult.rows[0];
					const branchSlug = `${main.slug}-branch-${Math.random().toString(16).slice(2, 8)}`;

					const newBranchResult = await client.query<{ id: number }>(
						`INSERT INTO businesses_1
						 (rscore, isvisible, pluscode, phonenumber, email, login_email, login_password,
						  website, gstn, state, district, tag, slug, city, businessname, address, services, description)
						 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $11, $14, $15, $16, $17)
						 RETURNING id`,
						[
							main.rscore,
							main.isvisible,
							main.pluscode,
							main.phonenumber,
							main.email,
							main.login_email,
							main.login_password,
							main.website,
							main.gstn,
							leadState,
							leadDistrict,
							main.tag,
							branchSlug,
							main.businessname,
							main.address,
							main.services,
							main.description ?? 'Solar panel installer'
						]
					);
					const newBranchId = newBranchResult.rows[0].id;

					await client.query(
						'INSERT INTO branches (main_id, branch_id, isactive) VALUES ($1, $2, true)',
						[mainBusinessId, newBranchId]
					);

					effectiveBusinessId = newBranchId;
				} else {
					effectiveBusinessId = presenceResult.rows[0].id;
				}
			}

			// Insert into leaddata_claimrequests
			// Note: UNIQUE constraint on (lead_id, business_id) provides additional protection
			const insertResult = await client
				.query<ClaimRequestRow>(
					'INSERT INTO leaddata_claimrequests (lead_id, claim_id, business_id) VALUES ($1, $2, $3) RETURNING id',
					[lead_id, claim_id, effectiveBusinessId]
				)
				.catch((error: Error & { code?: string }) => {
					// Handle unique constraint violation (PostgreSQL error code 23505)
					if (error.code === '23505') {
						throw new Error('You have already claimed this lead');
					}
					throw error;
				});

			const claimRequestId = insertResult.rows[0].id;

			// Increment claim_count in leaddata
			await client.query('UPDATE leaddata SET claim_count = claim_count + 1 WHERE id = $1', [
				lead_id
			]);

			// Auto-allocate ALL successful claims (within 5-claim limit)
			// Since we passed the claim limit check, auto-allocate this claim

			// Set this claim as allotted
			await client.query(
				'UPDATE leaddata_claimrequests SET isallotted = true, isresolved = true WHERE id = $1',
				[claimRequestId]
			);

			// Fetch original lead data to create allocated lead
			const leadDataResult = await client.query<LeadDataRow>(
				'SELECT * FROM leaddata WHERE id = $1',
				[lead_id]
			);

			if (leadDataResult.rows.length > 0) {
				const originalLead = leadDataResult.rows[0];
				customer = { name: originalLead.name, email: originalLead.email };

				// Create new lead entry for the allocated business
				const newLeadResult = await client.query<NewLeadRow>(
					`INSERT INTO leaddata
                     (name, phone, email, pin_code, type, comment, created_at, svnotes, sv_comment_for_businesses, urlparams, isvisible, category, district, stage, status, claim_count, original_id, business_id)
                    VALUES
                     ($1, $2, $3, $4, $5, $6, NOW(), $7, $8, $9, true, 2, $10, 0, true, 0, $11, $12)
                    RETURNING *`,
					[
						originalLead.name,
						originalLead.phone,
						originalLead.email,
						originalLead.pin_code,
						originalLead.type,
						originalLead.comment,
						originalLead.svnotes,
						originalLead.sv_comment_for_businesses,
						originalLead.urlparams,
						originalLead.district,
						originalLead.id, // Set original_id to the original lead's ID
						effectiveBusinessId // Set business_id to the branch serving the lead's district
					]
				);
				newLead = newLeadResult.rows[0] ?? null;
			}

			// Prepare email data but don't send yet (move outside transaction)
			allotmentBusinessId = mainBusinessId;
			customerBusinessId = effectiveBusinessId;

			// Project the rows written above into the unified tables (covers the
			// auto-created branch, the claim-count bump and the claimed copy).
			await syncInSplitTables(client, effectiveBusinessId);
			await syncBusinessToUnified(client, 'in', effectiveBusinessId);
			await syncAccountToUnified(client, 'in', effectiveBusinessId);
			await syncLeadToUnified(client, 'in', lead_id);
			if (newLead) {
				await syncLeadToUnified(client, 'in', newLead.id);
			}

			await client.query('COMMIT');
		} catch (error) {
			await client.query('ROLLBACK');
			console.error('❌ Error claiming lead:', error);
			const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
			return json({ success: false, error: errorMessage }, { status: 500 });
		} finally {
			client.release();
		}

		// Send emails AFTER transaction commits, directly and in parallel —
		// internal fetch hops added latency and hid Brevo failures
		const adminEmail = 'admin@solarvipani.com';

		const sendAllotmentEmail = async () => {
			if (!allotmentBusinessId) return;
			try {
				const bizResult = await pool.query<{
					businessname: string;
					login_email: string;
					slug: string;
				}>(
					'SELECT businessname, login_email, slug FROM businesses_1 WHERE id = $1 LIMIT 1',
					[allotmentBusinessId]
				);
				if (bizResult.rows.length === 0) {
					console.error('❌ Allotment email skipped: business not found', allotmentBusinessId);
					return;
				}
				const { businessname, login_email, slug } = bizResult.rows[0];
				// Mint a fresh token (stored hashed); email the raw token.
				const rawToken = await mintBusinessTokenById(pool, 'businesses_1', allotmentBusinessId);
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

				const result = await sendEmail([login_email, adminEmail], subject, message, { isHtml: true });
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
				const bizResult = await pool.query<{
					businessname: string;
					phonenumber: string | null;
					email: string | null;
					slug: string;
				}>(
					`SELECT businessname, phonenumber, email, slug FROM in_business_profiles WHERE business_id = $1`,
					[customerBusinessId]
				);
				if (bizResult.rows.length === 0) {
					console.error('❌ Customer email skipped: business not found', customerBusinessId);
					return;
				}
				const business = bizResult.rows[0];
				const profileLink = `https://solarvipani.com/in/installer/${business.slug}`;

				// Mint a fresh user token (stored hashed, upserts the in_user row);
				// email the raw token.
				const magicLinkToken = await mintUserToken(pool, customer.email, customer.name || null);
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
