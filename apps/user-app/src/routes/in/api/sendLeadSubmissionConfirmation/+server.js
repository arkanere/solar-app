import { json } from '@sveltejs/kit';
import { sendEmail } from '$lib/sendEmail.js';
import { internalSecretHeaders } from '$lib/server/internalAuth.js';
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, fetch }) {
	try {
		const { name, phone, pinCode, comment, urlParam, email, district, state } = await request.json();

		if (!email) {
			return json({ success: false, error: 'No email provided for confirmation' }, { status: 400 });
		}

		const isExclusiveLead = urlParam && urlParam.includes('/solar-panel-installer/');

		let magicLinkUrl = '';
		if (!isExclusiveLead) {
			try {
				const magicLinkResponse = await fetch('/in/api/generateUserMagicLink', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json', ...internalSecretHeaders() },
					body: JSON.stringify({ email, name })
				});

				if (magicLinkResponse.ok) {
					const magicLinkData = await magicLinkResponse.json();
					magicLinkUrl = magicLinkData.magicLinkUrl;
				}
			} catch (magicLinkError) {
				console.error('Error generating magic link:', magicLinkError);
			}
		}

		let installers = [];
		try {
			const pool = createPool({ connectionString: POSTGRES_URL });
			if (isExclusiveLead) {
				const slugMatch = urlParam.match(/\/(?:solar-panel-installer|installer)\/([^/?#]+)/);
				if (slugMatch) {
					const result = await pool.query(
						`SELECT businessname, address, phonenumber
						 FROM businesses_1
						 WHERE slug = $1 AND isvisible = true
						 LIMIT 1`,
						[slugMatch[1]]
					);
					installers = result.rows;
				}
			} else if (district) {
				const result = await pool.query(
					`SELECT businessname, address, phonenumber
					 FROM businesses_1
					 WHERE LOWER(district) = LOWER($1) AND isvisible = true
					 ORDER BY rscore DESC NULLS LAST
					 LIMIT 5`,
					[district]
				);
				installers = result.rows;
			}
		} catch (e) {
			console.error('Error fetching installers for email:', e);
		}

		const installersHeading = isExclusiveLead ? 'Your Solar Installer:' : 'Top Solar Installers in Your Area:';
		const installersHtml = installers.length > 0 ? `
			<p><strong>${installersHeading}</strong></p>
			<table style="width:100%; border-collapse:collapse; margin-bottom:16px;">
				${installers.map(b => `
				<tr style="border-bottom:1px solid #eee;">
					<td style="padding:8px 4px;">
						<strong>${b.businessname}</strong>
						${b.address ? `<br><span style="color:#666; font-size:13px;">${b.address}</span>` : ''}
						${b.phonenumber ? `<br><a href="tel:${b.phonenumber}" style="color:#0056b3; font-size:13px;">${b.phonenumber}</a>` : ''}
					</td>
				</tr>`).join('')}
			</table>
		` : '';

		const adminEmail = 'admin@solarvipani.com';
		const subject = 'Thank You for Your Inquiry - Solar Vipani';

		let message;
		if (isExclusiveLead) {
			message = `
				<p>Dear ${name},</p>
				<p>Thank you for submitting your inquiry on Solar Vipani! We appreciate your interest in solar energy solutions.</p>
				<p>Here are the details of your request:</p>
				<ul>
					<li><strong>Phone:</strong> ${phone}</li>
					<li><strong>Email:</strong> ${email}</li>
					<li><strong>Pin Code:</strong> ${pinCode}</li>
					<li><strong>Comment:</strong> ${comment}</li>
				</ul>
				${installersHtml}
				<p>The installer will reach out to you in a couple of days to assist you further. In case you are looking to talk to someone right away, you can directly call the installer using the above contact details.</p>
				<p>If you have any questions or need immediate assistance, feel free to contact us at <a href="mailto:admin@solarvipani.com">admin@solarvipani.com</a>.</p>
				<p>Thank you for choosing Solar Vipani. We look forward to helping you find the perfect solar solution!</p>
				<p>Best Regards,<br><strong>Solar Vipani Team</strong></p>
			`;
		} else {
			message = `
				<p>Dear ${name},</p>
				<p>Thank you for submitting your inquiry on Solar Vipani! We appreciate your interest in solar energy solutions.</p>
				<p>Here are the details of your request:</p>
				<ul>
					<li><strong>Phone:</strong> ${phone}</li>
					<li><strong>Email:</strong> ${email}</li>
					<li><strong>Pin Code:</strong> ${pinCode}</li>
					<li><strong>Comment:</strong> ${comment}</li>
				</ul>
				${magicLinkUrl ? `
				<p><strong>Track Your Solar Journey:</strong></p>
				<p>Access your personalized dashboard to track your installation progress and view interested installers: <a href="${magicLinkUrl}" style="color: #0056b3; font-weight: bold;">Click here to access your dashboard</a></p>
				` : ''}
				${installersHtml}
				${installers.length > 0 ? `
				<p>One of our verified solar installers in your area will reach out to you in a couple of days to assist you further. In case you are looking to talk to someone right away, you can directly call the installers using the above contact details.</p>
				` : `
				<p>We currently don't have a solar installation partner in your area, but we're expanding rapidly across India. As soon as a verified installer joins in your area, we will reach out to you with their details so you can get started on your solar journey.</p>
				`}
				<p>If you have any questions or need immediate assistance, feel free to contact us at <a href="mailto:admin@solarvipani.com">admin@solarvipani.com</a>.</p>
				<p>Thank you for choosing Solar Vipani. We look forward to helping you find the perfect solar solution!</p>
				<p>Best Regards,<br><strong>Solar Vipani Team</strong></p>
			`;
		}

		await sendEmail([email, adminEmail], subject, message, { isHtml: true });

		return json({ success: true, magicLinkGenerated: !!magicLinkUrl, isExclusiveLead });
	} catch (error) {
		console.error('Error sending lead submission confirmation:', error);
		return json({ success: false, error: 'Failed to send confirmation email' }, { status: 500 });
	}
}
