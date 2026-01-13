import { BREVO_API_KEY } from '$env/static/private';
import type { EmailResult } from '$lib/types/api';

// Brevo API endpoint for sending emails
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

interface SendEmailOptions {
	isHtml?: boolean;
	senderName?: string;
	senderEmail?: string;
}

interface TemplatedEmailOptions {
	senderName?: string;
	senderEmail?: string;
}

interface IndividualEmailResult {
	recipient: string;
	success: boolean;
	error?: string;
	messageId?: string;
}

/**
 * Send email using Brevo API
 */
export async function sendEmail(
	recipients: string | string[],
	subject: string,
	message: string,
	options: SendEmailOptions = {}
): Promise<EmailResult> {
	const {
		isHtml = false,
		senderName = 'Solar Vipani',
		senderEmail = 'admin@solarvipani.com'
	} = options;

	// Ensure recipients is an array
	let recipientArray: string[] = Array.isArray(recipients) ? recipients : [recipients];

	// Validate inputs
	if (!recipientArray.length || !subject || !message) {
		return {
			success: false,
			error: 'Missing required parameters: recipients, subject, or message'
		};
	}

	if (!BREVO_API_KEY) {
		return {
			success: false,
			error: 'BREVO_API_KEY environment variable is not set'
		};
	}

	// Prepare the email payload for Brevo
	const emailData = {
		sender: {
			name: senderName,
			email: senderEmail
		},
		to: recipientArray.map(email => ({ email })),
		subject: subject,
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
			console.log(`Email sent successfully to ${recipientArray.join(', ')}`);
			console.log('Brevo response:', responseData);

			return {
				success: true,
				messageId: responseData.messageId,
				recipients: recipientArray,
				results: recipientArray.map(recipient => ({
					recipient,
					success: true
				}))
			};
		} else {
			console.error('Brevo API error:', responseData);

			return {
				success: false,
				error: responseData.message || 'Failed to send email',
				code: responseData.code,
				results: recipientArray.map(recipient => ({
					recipient,
					success: false,
					error: responseData.message || 'Failed to send email'
				}))
			};
		}
	} catch (error) {
		console.error('Error sending email via Brevo:', error);

		return {
			success: false,
			error: error instanceof Error ? error.message : 'Network error while sending email',
			results: recipientArray.map(recipient => ({
				recipient,
				success: false,
				error: error instanceof Error ? error.message : 'Network error'
			}))
		};
	}
}

/**
 * Send email to multiple recipients individually (separate API calls)
 * Useful when you need to track individual delivery status
 */
export async function sendEmailIndividually(
	recipients: string | string[],
	subject: string,
	message: string,
	options: SendEmailOptions = {}
): Promise<{ success: boolean; results: IndividualEmailResult[] }> {
	let recipientArray: string[] = Array.isArray(recipients) ? recipients : [recipients];

	const emailPromises = recipientArray.map(async (recipient) => {
		const result = await sendEmail([recipient], subject, message, options);
		return {
			recipient,
			success: result.success,
			error: result.error,
			messageId: result.messageId
		};
	});

	const results = await Promise.all(emailPromises);
	const allSuccess = results.every(result => result.success);

	return {
		success: allSuccess,
		results
	};
}

/**
 * Send templated email using Brevo templates
 */
export async function sendTemplatedEmail(
	recipients: string | string[],
	templateId: number,
	templateParams: Record<string, unknown> = {},
	options: TemplatedEmailOptions = {}
): Promise<EmailResult> {
	const {
		senderName = 'Solar Vipani',
		senderEmail = 'admin@solarvipani.com'
	} = options;

	// Ensure recipients is an array
	let recipientArray: string[] = Array.isArray(recipients) ? recipients : [recipients];

	if (!BREVO_API_KEY) {
		return {
			success: false,
			error: 'BREVO_API_KEY environment variable is not set'
		};
	}

	const emailData = {
		sender: {
			name: senderName,
			email: senderEmail
		},
		to: recipientArray.map(email => ({ email })),
		templateId: templateId,
		params: templateParams
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
			console.log(`Templated email sent successfully to ${recipientArray.join(', ')}`);

			return {
				success: true,
				messageId: responseData.messageId,
				recipients: recipientArray
			};
		} else {
			console.error('Brevo template API error:', responseData);

			return {
				success: false,
				error: responseData.message || 'Failed to send templated email',
				code: responseData.code
			};
		}
	} catch (error) {
		console.error('Error sending templated email via Brevo:', error);

		return {
			success: false,
			error: error instanceof Error ? error.message : 'Network error while sending templated email'
		};
	}
}
