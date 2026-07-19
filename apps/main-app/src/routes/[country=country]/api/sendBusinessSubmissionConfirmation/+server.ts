// Unified replacement for /in/api/sendBusinessSubmissionConfirmation and
// /us/api/sendBusinessSubmissionConfirmation.
//
// The two legacy handlers differed only in brand name, the level2 label
// (District vs County), and the tax-id line, which IN showed as GSTN and US
// omitted entirely. The tax-id line is now shown whenever a value is present,
// labelled per country.
import { json, type RequestHandler } from '@sveltejs/kit';
import { sendEmail } from '$lib/sendEmail';
import { getCountry, isCountry } from '$lib/countries';

export const POST: RequestHandler = async ({ request, params }) => {
	if (!params.country || !isCountry(params.country)) {
		return json({ success: false, error: 'Unknown country' }, { status: 404 });
	}
	const country = getCountry(params.country);

	try {
		const data = await request.json();
		const { businessName, address, plusCode, phoneNumber, email, login_email, website, gstn, state, city } =
			data;
		// Callers send district (IN) or county (US).
		const level2 = data.district ?? data.county ?? data.level2 ?? '';

		if (!email) {
			return json({ success: false, error: 'No email provided for confirmation' }, { status: 400 });
		}

		const adminEmail = 'admin@solarvipani.com';
		const subject = `Business Details Received For Listing - ${country.brandName}`;

		const message = `
            <p>Dear ${businessName} Team,</p>
            <p>Thank you for submitting your business details with ${country.brandName} for business listing!</p>
            <p>Here are the business details submitted in the form:</p>
            <ul>
                <li><strong>Business Name:</strong> ${businessName}</li>
                <li><strong>Address:</strong> ${address}</li>
                <li><strong>City:</strong> ${city}</li>
                <li><strong>${country.levels.level2.singular}:</strong> ${level2}</li>
                <li><strong>State:</strong> ${state}</li>
                <li><strong>Plus Code:</strong> ${plusCode || 'Not provided'}</li>
                <li><strong>Phone Number:</strong> ${phoneNumber}</li>
                <li><strong>Email:</strong> ${email}</li>
                <li><strong>Login Email:</strong> ${login_email}</li>
                <li><strong>Website:</strong> ${website || 'Not provided'}</li>
                ${gstn ? `<li><strong>${country.taxId.label}:</strong> ${gstn}</li>` : ''}
            </ul>
            <p>Our team will review your business details shortly. Once verified, your business will be visible on our platform.</p>
            <p>After verification, you will receive login credentials to manage your business profile via email.</p>
            <p>If you have any questions or need immediate assistance, feel free to contact us at <a href="mailto:admin@solarvipani.com">admin@solarvipani.com</a>.</p>
            <p>Thank you for choosing ${country.brandName}. We look forward to a successful partnership!</p>
            <p>Best Regards,<br><strong>${country.brandName} Team</strong></p>
        `;

		// Send to both the business login address and admin.
		await sendEmail([login_email, adminEmail], subject, message, { isHtml: true });

		return json({ success: true });
	} catch (error) {
		console.error('Error sending business submission confirmation:', error);
		return json(
			{ success: false, error: 'Failed to send business confirmation email' },
			{ status: 500 }
		);
	}
};
