// Unified replacement for /in/api/sendLeadSubmissionConfirmation and
// /us/api/sendLeadSubmissionConfirmation.
//
// The two legacy handlers differed only in brand name, postal-code label, and
// whether a customer-dashboard magic link is offered — all of which now come
// from CountryConfig. The IN version kept two near-identical templates (one
// with the magic link, one without); they collapse into a single template
// because the magic-link block is already conditional on having a URL.
import { json, type RequestHandler } from '@sveltejs/kit';
import { sendEmail } from '$lib/sendEmail';
import { getCountry, isCountry } from '$lib/countries';
import { internalSecretHeaders } from '$lib/server/internalAuth';

export const POST: RequestHandler = async ({ request, params, fetch }) => {
	if (!params.country || !isCountry(params.country)) {
		return json({ success: false, error: 'Unknown country' }, { status: 404 });
	}
	const country = getCountry(params.country);

	try {
		const data = await request.json();
		const { name, phone, comment, urlParam, email } = data;
		// Forms and submitLead send pinCode (IN) or zipCode (US).
		const postalCode = data.pinCode ?? data.zipCode ?? data.postalCode ?? '';

		if (!email) {
			return json({ success: false, error: 'No email provided for confirmation' }, { status: 400 });
		}

		// Exclusive leads go to a single installer, so they get no dashboard link.
		const isExclusiveLead = Boolean(urlParam && urlParam.includes('/solar-panel-installer/'));

		let magicLinkUrl = '';
		if (country.features.userAccounts && !isExclusiveLead) {
			try {
				const magicLinkResponse = await fetch(`/${country.code}/api/generateUserMagicLink`, {
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
				// Continue without magic link if generation fails.
			}
		}

		const adminEmail = 'admin@solarvipani.com';
		const subject = `Thank You for Your Inquiry - ${country.brandName}`;

		const message = `
            <p>Dear ${name},</p>
            <p>Thank you for submitting your inquiry on ${country.brandName}! We appreciate your interest in solar energy solutions.</p>
            <p>Here are the details of your request:</p>
            <ul>
                <li><strong>Phone:</strong> ${phone}</li>
                <li><strong>Email:</strong> ${email}</li>
                <li><strong>${country.postalCode.label}:</strong> ${postalCode}</li>
                <li><strong>Comment:</strong> ${comment}</li>
            </ul>
            ${
							magicLinkUrl
								? `
            <p><strong>Track Your Solar Journey:</strong></p>
            <p>Access your personalized dashboard to track your installation progress and view interested installers: <a href="${magicLinkUrl}" style="color: #0056b3; font-weight: bold;">Click here to access your dashboard</a></p>
            `
								: ''
						}
            <p>One of our team members or a verified solar installer in your area will be in touch with you shortly to assist you further.</p>
            <p>If you have any questions or need immediate assistance, feel free to contact us at <a href="mailto:admin@solarvipani.com">admin@solarvipani.com</a>.</p>
            <p>Thank you for choosing ${country.brandName}. We look forward to helping you find the perfect solar solution!</p>
            <p>Best Regards,<br><strong>${country.brandName} Team</strong></p>
        `;

		// Send to both the customer and admin.
		await sendEmail([email, adminEmail], subject, message, { isHtml: true });

		return json({
			success: true,
			magicLinkGenerated: Boolean(magicLinkUrl),
			isExclusiveLead
		});
	} catch (error) {
		console.error('Error sending lead submission confirmation:', error);
		return json({ success: false, error: 'Failed to send confirmation email' }, { status: 500 });
	}
};
