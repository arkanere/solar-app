import sgMail from '@sendgrid/mail';

// Set the SendGrid API key from the environment variable
sgMail.setApiKey(import.meta.env.VITE_SENDGRID_API_KEY);

/**
 * Sends a password reset email using SendGrid
 */
export async function sendPasswordResetEmail(email: string, resetLink: string): Promise<void> {
	const msg = {
		to: email, // Recipient's email address
		from: 'admin@solarvipani.com', // Sender's email (should be verified with SendGrid)
		subject: 'Solar Vipani Business Account Password Reset',
		text: `This a a mail for password reset. Click the following link to reset your password: ${resetLink}`,
		html: `<p>You requested a password reset. Click the following link to reset your password:</p>
           <a href="${resetLink}">${resetLink}</a>
           <p> After password reset. You may login to your business account using same email address as 'Login Email' and new passwords </p>
           <p> The link will expire in few days </p>
           <p>If you did not request this, please ignore this email.</p>
           <p>Admin</p>
           <p>Solar Vipani</p>`
	};

	try {
		// Send the email via SendGrid
		await sgMail.send(msg);
		console.log(`Password reset email sent to ${email}`);
	} catch (error) {
		console.error('Error sending password reset email:', error);
		throw new Error('Failed to send email');
	}
}
