import { BREVO_API_KEY } from '$env/static/private';

// Brevo API endpoint for sending emails
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

/**
 * Send email using Brevo API
 * @param {string|string[]} recipients - Email recipient(s)
 * @param {string} subject - Email subject
 * @param {string} message - Email content
 * @param {Object} options - Additional options
 * @param {boolean} options.isHtml - Whether the message is HTML (default: false)
 * @param {string} options.senderName - Sender name (default: 'Solar Vipani')
 * @param {string} options.senderEmail - Sender email (default: 'admin@solarvipani.com')
 * @returns {Promise<Object>} Result object with success status and details
 */
export async function sendEmail(recipients, subject, message, options = {}) {
	const {
		isHtml = false,
		senderName = 'Solar Vipani',
		senderEmail = 'admin@solarvipani.com'
	} = options;

	// Ensure recipients is an array
	if (!Array.isArray(recipients)) {
		recipients = [recipients];
	}

	// Validate inputs
	if (!recipients.length || !subject || !message) {
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
		to: recipients.map(email => ({ email })),
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
			console.log(`Email sent successfully to ${recipients.join(', ')}`);
			console.log('Brevo response:', responseData);
			
			return {
				success: true,
				messageId: responseData.messageId,
				recipients: recipients,
				results: recipients.map(recipient => ({
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
				results: recipients.map(recipient => ({
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
			error: error.message || 'Network error while sending email',
			results: recipients.map(recipient => ({
				recipient,
				success: false,
				error: error.message || 'Network error'
			}))
		};
	}
}

/**
 * Send email to multiple recipients individually (separate API calls)
 * Useful when you need to track individual delivery status
 * @param {string[]} recipients - Array of email recipients
 * @param {string} subject - Email subject
 * @param {string} message - Email content
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Result object with detailed status for each recipient
 */
export async function sendEmailIndividually(recipients, subject, message, options = {}) {
	if (!Array.isArray(recipients)) {
		recipients = [recipients];
	}

	const emailPromises = recipients.map(async (recipient) => {
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
 * @param {string|string[]} recipients - Email recipient(s)
 * @param {number} templateId - Brevo template ID
 * @param {Object} templateParams - Template parameters
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Result object with success status and details
 */
export async function sendTemplatedEmail(recipients, templateId, templateParams = {}, options = {}) {
	const {
		senderName = 'Solar Vipani',
		senderEmail = 'admin@solarvipani.com'
	} = options;

	// Ensure recipients is an array
	if (!Array.isArray(recipients)) {
		recipients = [recipients];
	}

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
		to: recipients.map(email => ({ email })),
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
			console.log(`Templated email sent successfully to ${recipients.join(', ')}`);
			
			return {
				success: true,
				messageId: responseData.messageId,
				recipients: recipients
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
			error: error.message || 'Network error while sending templated email'
		};
	}
}