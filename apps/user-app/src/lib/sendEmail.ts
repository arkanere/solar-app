import { BREVO_API_KEY } from '$env/static/private';

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

export interface SendEmailOptions {
	isHtml?: boolean;
	senderName?: string;
	senderEmail?: string;
}

export type SendEmailResult =
	| { success: true; messageId: string; recipients: string[] }
	| { success: false; error: string };

export async function sendEmail(
	recipients: string | string[],
	subject: string,
	message: string,
	options: SendEmailOptions = {}
): Promise<SendEmailResult> {
	const {
		isHtml = false,
		senderName = 'Solar Vipani',
		senderEmail = 'admin@solarvipani.com'
	} = options;

	const recipientArray = Array.isArray(recipients) ? recipients : [recipients];

	if (!recipientArray.length || !subject || !message) {
		return { success: false, error: 'Missing required parameters' };
	}

	if (!BREVO_API_KEY) {
		return { success: false, error: 'BREVO_API_KEY environment variable is not set' };
	}

	const emailData = {
		sender: { name: senderName, email: senderEmail },
		to: recipientArray.map((email) => ({ email })),
		subject,
		...(isHtml ? { htmlContent: message } : { textContent: message })
	};

	try {
		const response = await fetch(BREVO_API_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'api-key': BREVO_API_KEY
			},
			body: JSON.stringify(emailData)
		});

		const responseData = await response.json();

		if (response.ok) {
			return { success: true, messageId: responseData.messageId, recipients: recipientArray };
		} else {
			console.error('Brevo API error:', responseData);
			return { success: false, error: responseData.message || 'Failed to send email' };
		}
	} catch (error) {
		console.error('Error sending email via Brevo:', error);
		return {
			success: false,
			error: (error instanceof Error ? error.message : '') || 'Network error'
		};
	}
}
