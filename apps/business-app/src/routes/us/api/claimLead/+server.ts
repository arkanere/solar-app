import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { json, type RequestHandler } from '@sveltejs/kit';
import { BusinessAuthService } from '$lib/us/auth/business';
import { sendEmail } from '$lib/us/sendEmail';
import { mintBusinessTokenById } from '$lib/server/magicLink';
import { checkLeadDataPolicy } from '$lib/compliance';
import type { ClaimRequestPayload } from '$lib/types/lead';

interface ClaimCountRow {
	claim_count: number;
}

interface ClaimRequestRow {
	id: number;
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
	county: string | null;
}

interface EmailData {
	business_id: number;
	isallotted: boolean;
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
		const compliance = await checkLeadDataPolicy(pool, business_id);
		if (!compliance.compliant) {
			return json({ success: false, error: 'compliance_required' }, { status: 403 });
		}

		// Start a transaction
		const client = await pool.connect();
		let emailData: EmailData | null = null; // Store email data to send after transaction
		let customerEmailData: { lead_id: number; business_id: number } | null = null;

		try {
			await client.query('BEGIN');

			// Lock the row to prevent race conditions & fetch claim count
			const claimCountResult = await client.query<ClaimCountRow>(
				'SELECT claim_count FROM us_leaddata WHERE id = $1 FOR UPDATE',
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
				'SELECT id FROM us_leaddata_claimrequests WHERE lead_id = $1 AND business_id = $2',
				[lead_id, business_id]
			);

			if (duplicateCheck.rows.length > 0) {
				await client.query('ROLLBACK');
				return json(
					{ success: false, error: 'You have already claimed this lead' },
					{ status: 400 }
				);
			}

			// Insert into us_leaddata_claimrequests
			// Note: UNIQUE constraint on (lead_id, business_id) provides additional protection
			const insertResult = await client
				.query<ClaimRequestRow>(
					'INSERT INTO us_leaddata_claimrequests (lead_id, claim_id, business_id) VALUES ($1, $2, $3) RETURNING id',
					[lead_id, claim_id, business_id]
				)
				.catch((error: Error & { code?: string }) => {
					// Handle unique constraint violation (PostgreSQL error code 23505)
					if (error.code === '23505') {
						throw new Error('You have already claimed this lead');
					}
					throw error;
				});

			const claimRequestId = insertResult.rows[0].id;

			// Increment claim_count in us_leaddata
			await client.query('UPDATE us_leaddata SET claim_count = claim_count + 1 WHERE id = $1', [
				lead_id
			]);

			// Auto-allocate ALL successful claims (within 5-claim limit)
			// Since we passed the claim limit check, auto-allocate this claim

			// Set this claim as allotted
			await client.query(
				'UPDATE us_leaddata_claimrequests SET isallotted = true, isresolved = true WHERE id = $1',
				[claimRequestId]
			);

			// Fetch original lead data to create allocated lead
			const leadDataResult = await client.query<LeadDataRow>(
				'SELECT * FROM us_leaddata WHERE id = $1',
				[lead_id]
			);

			if (leadDataResult.rows.length > 0) {
				const originalLead = leadDataResult.rows[0];

				// Create new lead entry for the allocated business
				await client.query(
					`INSERT INTO us_leaddata
                     (name, phone, email, pin_code, type, comment, created_at, svnotes, sv_comment_for_businesses, urlparams, isvisible, category, county, stage, status, claim_count, original_id, business_id)
                    VALUES
                     ($1, $2, $3, $4, $5, $6, NOW(), $7, $8, $9, true, 2, $10, 0, true, 0, $11, $12)`,
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
						originalLead.county,
						originalLead.id, // Set original_id to the original lead's ID
						business_id // Set business_id from claim request
					]
				);
			}

			// Prepare email data but don't send yet (move outside transaction)
			emailData = { business_id, isallotted: true };
			customerEmailData = { lead_id, business_id };

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
				const bizResult = await pool.query<{
					businessname: string;
					login_email: string;
					slug: string;
				}>(
					'SELECT businessname, login_email, slug FROM businesses_1 WHERE id = $1 LIMIT 1',
					[emailData.business_id]
				);

				if (bizResult.rows.length === 0) {
					console.error('❌ Allotment email skipped: business not found', emailData.business_id);
				} else {
					const { businessname, login_email, slug } = bizResult.rows[0];
					const adminEmail = 'admin@solarvipani.com';
					// Mint a fresh token (stored hashed); email the raw token.
					const rawToken = await mintBusinessTokenById(pool, 'businesses_1', emailData.business_id);
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

					const result = await sendEmail([login_email, adminEmail], subject, message, {
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
				const leadResult = await pool.query<{ name: string; email: string | null }>(
					'SELECT name, email FROM us_leaddata WHERE id = $1',
					[customerEmailData.lead_id]
				);
				const lead = leadResult.rows[0];

				if (!lead?.email) {
					// No customer email on file — nothing to notify
				} else {
					const bizResult = await pool.query<{
						businessname: string;
						phonenumber: string | null;
						email: string | null;
						slug: string;
					}>(
						'SELECT businessname, phonenumber, email, slug FROM businesses_1 WHERE id = $1',
						[customerEmailData.business_id]
					);

					if (bizResult.rows.length === 0) {
						console.error(
							'❌ Customer notification skipped: business not found',
							customerEmailData.business_id
						);
					} else {
						const business = bizResult.rows[0];
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
