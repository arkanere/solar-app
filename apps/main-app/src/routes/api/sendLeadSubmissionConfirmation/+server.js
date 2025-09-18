// src/routes/api/sendLeadSubmissionConfirmation/+server.js
import { json } from '@sveltejs/kit';
import { sendEmail } from '$lib/sendEmail'; // Utility for sending emails

export async function POST({ request, fetch }) {
	try {
		const { id, name, phone, pinCode, type, comment, urlParam, email } = await request.json();

		if (!email) {
			return json({ success: false, error: 'No email provided for confirmation' }, { status: 400 });
		}

		// Check if this is an exclusive lead (contains '/solar-panel-installer/' in urlParam)
		const isExclusiveLead = urlParam && urlParam.includes('/solar-panel-installer/');

		// Generate magic link only for non-exclusive leads
		let magicLinkUrl = '';
		if (!isExclusiveLead) {
			try {
				const magicLinkResponse = await fetch('/api/generateUserMagicLink', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ email, name })
				});

				if (magicLinkResponse.ok) {
					const magicLinkData = await magicLinkResponse.json();
					magicLinkUrl = magicLinkData.magicLinkUrl;
				}
			} catch (magicLinkError) {
				console.error('Error generating magic link:', magicLinkError);
				// Continue without magic link if generation fails
			}
		}

		const adminEmail = 'admin@solarvipani.com';
		const subject = `Thank You for Your Inquiry - Solar Vipani`;

		let message;
		if (isExclusiveLead) {
			// Original email template for exclusive leads (no magic link)
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
                <p>One of our team members or a verified solar installer in your area will be in touch with you shortly to assist you further.</p>
                <p>If you have any questions or need immediate assistance, feel free to contact us at <a href="mailto:admin@solarvipani.com">admin@solarvipani.com</a>.</p>
                <p>Thank you for choosing Solar Vipani. We look forward to helping you find the perfect solar solution!</p>
                <p>Best Regards,<br><strong>Solar Vipani Team</strong></p>
            `;
		} else {
			// Enhanced email template for non-exclusive leads (with magic link)
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
                <p>One of our team members or a verified solar installer in your area will be in touch with you shortly to assist you further.</p>
                <p>If you have any questions or need immediate assistance, feel free to contact us at <a href="mailto:admin@solarvipani.com">admin@solarvipani.com</a>.</p>
                <p>Thank you for choosing Solar Vipani. We look forward to helping you find the perfect solar solution!</p>
                <p>Best Regards,<br><strong>Solar Vipani Team</strong></p>
            `;
		}

		// Send email to both user and admin
		await sendEmail([email, adminEmail], subject, message, { isHtml: true });

		return json({ 
			success: true, 
			magicLinkGenerated: !!magicLinkUrl,
			isExclusiveLead 
		});
	} catch (error) {
		console.error('Error sending lead submission confirmation:', error);
		return json({ success: false, error: 'Failed to send confirmation email' }, { status: 500 });
	}
}
