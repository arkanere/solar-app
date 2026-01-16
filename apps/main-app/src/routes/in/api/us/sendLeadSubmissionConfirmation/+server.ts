import { json, type RequestHandler } from '@sveltejs/kit';
import { sendEmail } from '$lib/sendEmail';

interface ConfirmationData {
	id: number;
	name: string;
	phone: string;
	zipCode: string;
	type: string;
	comment: string;
	urlParam: string;
	email?: string;
}

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { name, phone, zipCode, comment, email } = await request.json() as ConfirmationData;

		if (!email) {
			return json({ success: false, error: 'No email provided for confirmation' }, { status: 400 });
		}

		const adminEmail = 'admin@solarvipani.com';
		const subject = `Thank You for Your Inquiry - Solar Vipani USA`;

		const message = `
            <p>Dear ${name},</p>
            <p>Thank you for submitting your inquiry on Solar Vipani USA! We appreciate your interest in solar energy solutions.</p> 
            <p>Here are the details of your request:</p>
            <ul>
                <li><strong>Phone:</strong> ${phone}</li>
                <li><strong>Email:</strong> ${email}</li>
                <li><strong>Zip Code:</strong> ${zipCode}</li>
                <li><strong>Comment:</strong> ${comment}</li>
            </ul>
            <p>One of our team members or a verified solar installer in your area will be in touch with you shortly to assist you further.</p>
            <p>If you have any questions or need immediate assistance, feel free to contact us at <a href="mailto:admin@solarvipani.com">admin@solarvipani.com</a>.</p>
            <p>Thank you for choosing Solar Vipani USA. We look forward to helping you find the perfect solar solution!</p>
            <p>Best Regards,<br><strong>Solar Vipani USA Team</strong></p>
        `;

		await sendEmail([email, adminEmail], subject, message, { isHtml: true });

		return json({ success: true });
	} catch (error) {
		console.error('Error sending US lead submission confirmation:', error);
		return json({ success: false, error: 'Failed to send confirmation email' }, { status: 500 });
	}
};
