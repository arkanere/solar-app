import { json, type RequestHandler } from '@sveltejs/kit';
import { sendEmail } from '$lib/sendEmail';

export const POST: RequestHandler = async () => {
	try {
		// Create the current date string in a readable format
		const today = new Date();
		const dateString = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD

		// Email details
		const recipientEmail = 'admin@solarvipani.com';
		const subject = `Cronjob ${dateString}`;
		const message = `
            <p>This is a mail for cronjob ${dateString}</p>
            <p>Server time when this email was sent: ${today.toLocaleString()}</p>
        `;

		// Send email
		await sendEmail([recipientEmail], subject, message, { isHtml: true });

		return json({
			success: true,
			message: `Email sent successfully to ${recipientEmail}`,
			timestamp: today.toISOString()
		});
	} catch (error) {
		console.error('Error sending cronjob email:', error);
		return json(
			{
				success: false,
				error: 'Failed to send cronjob email',
				errorDetails: (error as Error).message
			},
			{ status: 500 }
		);
	}
};

// Adding a GET handler so you can test it in browser if needed
export const GET: RequestHandler = async () => {
	return json({
		message:
			'This endpoint is designed to be called via POST by a scheduled task. Use POST to trigger the email sending.'
	});
};
