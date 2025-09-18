// src/routes/api/us/sendBusinessSubmissionConfirmation/+server.js
import { json } from '@sveltejs/kit';
import { sendEmail } from '$lib/sendEmail'; // Utility for sending emails

export async function POST({ request }) {
	try {
		const {
			id,
			businessName,
			address,
			plusCode,
			phoneNumber,
			email,
			login_email,
			website,
			gstn, // EIN for US
			state,
			county,
			city
		} = await request.json();

		if (!email) {
			return json({ success: false, error: 'No email provided for confirmation' }, { status: 400 });
		}

		const adminEmail = 'admin@solarvipani.com';

		const subject = `Business Details Received For Listing - Solar Vipani USA`;

		const message = `
            <p>Dear ${businessName} Team,</p>
            <p>Thank you for submitting your business details with Solar Vipani USA for business listing!</p> 
            <p>Here are the business details submitted in the form:</p>
            <ul>
                <li><strong>Business Name:</strong> ${businessName}</li>
                <li><strong>Address:</strong> ${address}</li>
                <li><strong>City:</strong> ${city}</li>
                <li><strong>County:</strong> ${county}</li>
                <li><strong>State:</strong> ${state}</li>
                <li><strong>Plus Code:</strong> ${plusCode || 'Not provided'}</li>
                <li><strong>Phone Number:</strong> ${phoneNumber}</li>
                <li><strong>Email:</strong> ${email}</li>
                <li><strong>Login Email:</strong> ${login_email}</li>
                <li><strong>Website:</strong> ${website || 'Not provided'}</li>
                <li><strong>EIN:</strong> ${gstn || 'Not provided'}</li>
            </ul>
            <p>Our team will review your business details shortly. Once verified, your business will be visible on our platform.</p>
            <p>After verification, you will receive login credentials to manage your business profile via email.</p>
            <p>If you have any questions or need immediate assistance, feel free to contact us at <a href="mailto:admin@solarvipani.com">admin@solarvipani.com</a>.</p>
            <p>Thank you for choosing Solar Vipani USA. We look forward to a successful partnership!</p>
            <p>Best Regards,<br><strong>Solar Vipani USA Team</strong></p>
        `;

		// Send email to both business email and admin
		await sendEmail([login_email, adminEmail], subject, message, { isHtml: true });

		return json({ success: true });
	} catch (error) {
		console.error('Error sending US business submission confirmation:', error);
		return json(
			{ success: false, error: 'Failed to send business confirmation email' },
			{ status: 500 }
		);
	}
}
