import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { json, type RequestHandler } from '@sveltejs/kit';
import { BusinessAuthService } from '$lib/in/auth/business';
import type { ClaimRequestPayload } from '$lib/types/lead';

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

interface EmailData {
	business_id: number;
	isallotted: boolean;
}

export const POST: RequestHandler = async ({ request, fetch, cookies }) => {
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

		// Start a transaction
		const client = await pool.connect();
		let emailData: EmailData | null = null; // Store email data to send after transaction
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
				const mainBusinessId =
					parentResult.rows.length > 0 ? parentResult.rows[0].main_id : business_id;

				// Check if main or any branch already serves the lead's district
				const presenceResult = await client.query<{ id: number }>(
					`SELECT b.id FROM businesses_1 b
					 WHERE b.district = $1
					 AND (b.id = $2 OR EXISTS (
					     SELECT 1 FROM branches WHERE main_id = $2 AND branch_id = b.id AND isactive = true
					 ))
					 LIMIT 1`,
					[leadDistrict, mainBusinessId]
				);

				if (presenceResult.rows.length === 0) {
					// No presence — auto-create a branch in the lead's district
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
			emailData = { business_id: effectiveBusinessId, isallotted: true };

			await client.query('COMMIT');
		} catch (error) {
			await client.query('ROLLBACK');
			console.error('❌ Error claiming lead:', error);
			const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
			return json({ success: false, error: errorMessage }, { status: 500 });
		} finally {
			client.release();
		}

		// Send email AFTER transaction commits (outside transaction for better performance)
		if (emailData) {
			try {
				const response = await fetch('/in/api/sendLeadAllotmentStatus', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(emailData)
				});

				const emailResult = (await response.json()) as { success: boolean; error?: string };

				if (!emailResult.success) {
					console.error('❌ Failed to send lead allotment email:', emailResult.error);
				}
			} catch (emailError) {
				console.error('❌ Error sending lead allotment email:', emailError);
				// Don't fail the whole request if email fails - claim was successful
			}
		}

		return json({ success: true, newLead });
	} catch (error) {
		console.error('❌ Database connection error:', error);
		return json(
			{ success: false, error: 'Failed to claim lead' },
			{ status: 500 }
		);
	}
};
