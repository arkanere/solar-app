import { createPool, type VercelPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import crypto from 'crypto';
import { json, type RequestHandler } from '@sveltejs/kit';
import { sendEmail } from '$lib/sendEmail.js';

interface PasswordResetRequest {
	login_email: string;
	slug: string;
}

interface BusinessResult {
	slug: string;
}

export const POST: RequestHandler = async ({ request }) => {
	const pool: VercelPool = createPool({ connectionString: POSTGRES_URL });
	const { login_email, slug } = await request.json() as PasswordResetRequest;

	try {
		const token = crypto.randomBytes(32).toString('hex');
		const expires = new Date();
		expires.setHours(expires.getHours() + 168);

		const updateQuery = `
      UPDATE us_businesses
      SET reset_token = $1, reset_token_expires = $2
      WHERE login_email = $3 AND slug = $4 RETURNING slug;
    `;
		const result = await pool.query<BusinessResult>(updateQuery, [token, expires, login_email, slug]);

		if (result.rows.length === 0) {
			return json(
				{ success: false, error: 'No business found with that login email and slug' },
				{ status: 404 }
			);
		}

		const { slug: business_slug } = result.rows[0];
		const resetLink = `https://solarvipani.com/us/business/${business_slug}/reset-password/${token}`;

		const subject = 'Solar Vipani Business Account Password Reset';
		
		const htmlMessage = `
			<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>Password Reset - Solar Vipani</title>
			</head>
			<body>
				<div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
					<div style="background-color: #f4f4f4; padding: 20px; text-align: center;">
						<h1 style="margin: 0; font-size: 24px; color: #2a9d8f;">Password Reset Request</h1>
					</div>
					<div style="margin: 20px 0;">
						<p>You requested a password reset for your Solar Vipani USA business account.</p>
						<p>Click the button below to reset your password:</p>
						<p style="text-align: center;">
							<a href="${resetLink}" 
							   style="background-color: #2a9d8f; color: #ffffff !important; text-decoration: none !important; 
									   font-weight: bold; font-size: 1.2em; padding: 12px 20px; border-radius: 5px; 
									   display: inline-block; text-align: center;">
								Reset Password
							</a>
						</p>
						<p><strong>Important:</strong> After resetting your password, you can login to your business account using the same email address as 'Login Email' and your new password.</p>
						<p><strong>Note:</strong> This link will expire in a few days for security reasons.</p>
						<p>If you did not request this password reset, please ignore this email.</p>
					</div>
					<div style="margin-top: 20px; font-size: 12px; text-align: center; color: #777;">
						<p>Solar Vipani<br>
						<a href="https://solarvipani.com/us">https://solarvipani.com/us</a> | 
						<a href="mailto:admin@solarvipani.com">admin@solarvipani.com</a></p>
					</div>
				</div>
			</body>
			</html>
		`;

		const emailResult = await sendEmail([login_email], subject, htmlMessage, { isHtml: true });
		
		if (!emailResult.success) {
			throw new Error(emailResult.error || 'Failed to send password reset email');
		}

		return json({ success: true });
	} catch (error) {
		console.error('Error sending password reset email:', error);
		return json({ success: false, error: 'Failed to send password reset email' }, { status: 500 });
	}
};
