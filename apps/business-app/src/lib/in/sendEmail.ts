import { BREVO_API_KEY } from '$env/static/private';

// Brevo API endpoint for sending emails
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

// Types for email functionality
interface EmailOptions {
	isHtml?: boolean;
	senderName?: string;
	senderEmail?: string;
}

interface EmailRecipient {
	recipient: string;
	success: boolean;
	error?: string;
}

interface EmailResult {
	success: boolean;
	error?: string;
	code?: string;
	messageId?: string;
	recipients?: string[];
	results?: EmailRecipient[];
}

interface IndividualEmailResult {
	recipient: string;
	success: boolean;
	error?: string;
	messageId?: string;
}

interface SendEmailIndividuallyResult {
	success: boolean;
	results: IndividualEmailResult[];
}

interface TemplatedEmailResult {
	success: boolean;
	error?: string;
	code?: string;
	messageId?: string;
	recipients?: string[];
}

// Brevo API types
interface BrevoSender {
	name: string;
	email: string;
}

interface BrevoRecipient {
	email: string;
}

interface BrevoEmailPayload {
	sender: BrevoSender;
	to: BrevoRecipient[];
	subject?: string;
	htmlContent?: string;
	textContent?: string;
	templateId?: number;
	params?: Record<string, any>;
}

interface BrevoResponse {
	messageId?: string;
	message?: string;
	code?: string;
}

/**
 * Send email using Brevo API
 * @param recipients - Email recipient(s)
 * @param subject - Email subject
 * @param message - Email content
 * @param options - Additional options
 * @returns Result object with success status and details
 */
export async function sendEmail(
	recipients: string | string[],
	subject: string,
	message: string,
	options: EmailOptions = {}
): Promise<EmailResult> {
	const {
		isHtml = false,
		senderName = 'Solar Vipani',
		senderEmail = 'admin@solarvipani.com'
	} = options;

	// Ensure recipients is an array
	let recipientsArray: string[];
	if (!Array.isArray(recipients)) {
		recipientsArray = [recipients];
	} else {
		recipientsArray = recipients;
	}

	// Validate inputs
	if (!recipientsArray.length || !subject || !message) {
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
	const emailData: BrevoEmailPayload = {
		sender: {
			name: senderName,
			email: senderEmail
		},
		to: recipientsArray.map((email) => ({ email })),
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

		const responseData: BrevoResponse = await response.json();

		if (response.ok) {
			console.log(`Email sent successfully to ${recipientsArray.join(', ')}`);
			console.log('Brevo response:', responseData);

			return {
				success: true,
				messageId: responseData.messageId,
				recipients: recipientsArray,
				results: recipientsArray.map((recipient) => ({
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
				results: recipientsArray.map((recipient) => ({
					recipient,
					success: false,
					error: responseData.message || 'Failed to send email'
				}))
			};
		}
	} catch (error) {
		console.error('Error sending email via Brevo:', error);
		const errorMessage = error instanceof Error ? error.message : 'Network error while sending email';

		return {
			success: false,
			error: errorMessage,
			results: recipientsArray.map((recipient) => ({
				recipient,
				success: false,
				error: errorMessage
			}))
		};
	}
}

/**
 * Send email to multiple recipients individually (separate API calls)
 * Useful when you need to track individual delivery status
 * @param recipients - Array of email recipients
 * @param subject - Email subject
 * @param message - Email content
 * @param options - Additional options
 * @returns Result object with detailed status for each recipient
 */
export async function sendEmailIndividually(
	recipients: string | string[],
	subject: string,
	message: string,
	options: EmailOptions = {}
): Promise<SendEmailIndividuallyResult> {
	let recipientsArray: string[];
	if (!Array.isArray(recipients)) {
		recipientsArray = [recipients];
	} else {
		recipientsArray = recipients;
	}

	const emailPromises = recipientsArray.map(async (recipient): Promise<IndividualEmailResult> => {
		const result = await sendEmail([recipient], subject, message, options);
		return {
			recipient,
			success: result.success,
			error: result.error,
			messageId: result.messageId
		};
	});

	const results = await Promise.all(emailPromises);
	const allSuccess = results.every((result) => result.success);

	return {
		success: allSuccess,
		results
	};
}

/**
 * Send templated email using Brevo templates
 * @param recipients - Email recipient(s)
 * @param templateId - Brevo template ID
 * @param templateParams - Template parameters
 * @param options - Additional options
 * @returns Result object with success status and details
 */
export async function sendTemplatedEmail(
	recipients: string | string[],
	templateId: number,
	templateParams: Record<string, any> = {},
	options: Omit<EmailOptions, 'isHtml'> = {}
): Promise<TemplatedEmailResult> {
	const { senderName = 'Solar Vipani', senderEmail = 'admin@solarvipani.com' } = options;

	// Ensure recipients is an array
	let recipientsArray: string[];
	if (!Array.isArray(recipients)) {
		recipientsArray = [recipients];
	} else {
		recipientsArray = recipients;
	}

	if (!BREVO_API_KEY) {
		return {
			success: false,
			error: 'BREVO_API_KEY environment variable is not set'
		};
	}

	const emailData: BrevoEmailPayload = {
		sender: {
			name: senderName,
			email: senderEmail
		},
		to: recipientsArray.map((email) => ({ email })),
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

		const responseData: BrevoResponse = await response.json();

		if (response.ok) {
			console.log(`Templated email sent successfully to ${recipientsArray.join(', ')}`);

			return {
				success: true,
				messageId: responseData.messageId,
				recipients: recipientsArray
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
		const errorMessage = error instanceof Error ? error.message : 'Network error while sending templated email';

		return {
			success: false,
			error: errorMessage
		};
	}
}
