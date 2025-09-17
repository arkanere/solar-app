import sgMail from '@sendgrid/mail'; // Assuming you're using SendGrid

// Set the SendGrid API key from the environment variable
export async function sendEmail(recipients, subject, message, options = { isHtml: false }) {
	sgMail.setApiKey(import.meta.env.VITE_SENDGRID_API_KEY); // Replace with your SendGrid API key

	// Ensure recipients is an array, if not convert to array
	if (!Array.isArray(recipients)) {
		recipients = [recipients];
	}

	// Prepare email type: HTML or plain text
	const msgType = options.isHtml ? { html: message } : { text: message };

	const emailPromises = recipients.map(async (recipient) => {
		const msg = {
			to: recipient,
			from: 'admin@solarvipani.com', // Ensure this is verified in SendGrid
			subject: subject,
			...msgType // Inject the right content type (html or text)
		};

		try {
			await sgMail.send(msg);
			console.log(`Email sent to ${recipient}`);
			return { recipient, success: true };
		} catch (error) {
			console.error(
				`Error sending email to ${recipient}:`,
				error.response?.body?.errors || error.message
			);
			return { recipient, success: false, error: error.response?.body?.errors || error.message };
		}
	});

	// Wait for all emails to be processed
	const results = await Promise.all(emailPromises);

	// Check if all emails were successful
	const allSuccess = results.every((result) => result.success);

	return {
		success: allSuccess,
		results // Array with the success/failure status of each email
	};
}
