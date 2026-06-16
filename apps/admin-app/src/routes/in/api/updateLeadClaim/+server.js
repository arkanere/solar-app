//src/routes/api/updateLeadClaim/+server.js

import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { sendEmail } from '$lib/sendEmail';

export async function POST({ request }) {
	const pool = createPool({ connectionString: POSTGRES_URL });

	try {
		const { id, lead_id, business_id, isallotted, isresolved } = await request.json();

		// Step 1: Update leaddata_claimrequests
		await pool.query(
			'UPDATE leaddata_claimrequests SET isallotted = $1, isresolved = $2 WHERE id = $3',
			[isallotted, isresolved, id]
		);

		let newLeadId = null;

		// Step 2: If lead is allotted, create a new lead entry
		if (isallotted) {
			// Fetch original lead data
			const leadDataResult = await pool.query('SELECT * FROM leaddata WHERE id = $1', [lead_id]);

			if (leadDataResult.rows.length > 0) {
				const originalLead = leadDataResult.rows[0];

				// Insert new lead entry with business_id, category = 2, stage = 0, status = true
				const newLeadResult = await pool.query(
					`INSERT INTO leaddata 
            (name, phone, email, pin_code, type, comment, created_at, svnotes, urlparams, isvisible, category, district, stage, status, claim_count, original_id, business_id)
           VALUES 
            ($1, $2, $3, $4, $5, $6, NOW(), $7, $8, true, 2, $9, 0, true, 0, $10, $11)  
           RETURNING id`, // ✅ Get the newly inserted lead's ID
					[
						originalLead.name,
						originalLead.phone,
						originalLead.email,
						originalLead.pin_code,
						originalLead.type,
						originalLead.comment,
						originalLead.svnotes,
						originalLead.urlparams,
						originalLead.district,
						originalLead.id, // Set original_id to the original lead's ID
						business_id // Set business_id from claim request
					]
				);

				newLeadId = newLeadResult.rows[0].id;
			}
		}

		// Notify the business when the lead has been allotted
		if (isallotted) {
			try {
				const bizResult = await pool.query(
					'SELECT businessname, login_email, slug, magic_link_token FROM businesses_1 WHERE id = $1 LIMIT 1',
					[business_id]
				);

				if (bizResult.rows.length === 0) {
					console.error('❌ Allotment email skipped: business not found', business_id);
				} else {
					const { businessname, login_email, slug, magic_link_token } = bizResult.rows[0];
					const adminEmail = 'admin@solarvipani.com';
					const magicLink = `https://business.solarvipani.com/in/${slug}/signin-link/${magic_link_token}`;

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

		return new Response(JSON.stringify({ success: true }), { status: 200 });
	} catch (error) {
		console.error('Error updating lead claim:', error);
		return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
	}
}
