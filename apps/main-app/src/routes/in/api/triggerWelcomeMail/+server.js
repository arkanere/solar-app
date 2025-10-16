import { json } from '@sveltejs/kit';
import { sendEmail } from '$lib/sendEmail.js'; // Brevo email utility to send emails

export async function POST({ request, fetch }) {
	const { login_email, slug, businessname, id } = await request.json(); // Data sent from the client-side

	try {
		// Call /api/createMagicLinkToken to generate a magic link token
		const magicTokenResponse = await fetch('/api/createMagicLinkToken', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ slug, id })
		});

		const magicTokenData = await magicTokenResponse.json();
		if (!magicTokenData.success) {
			throw new Error(magicTokenData.error || 'Failed to create magic link token');
		}

		const magic_link_token = magicTokenData.magic_link_token;
		const businessEmail = login_email;
		const adminEmail = 'admin@solarvipani.com';

		// Dynamic HTML email content
		const subject = `Welcome to Solar Vipani, ${businessname}! LOGIN to your account Now`;
		const message = `
      <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Solar Vipani</title>
        </head>
        <body>
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <div style="background-color: #f4f4f4; padding: 20px; text-align: center;">
                    <h1 style="margin: 0; font-size: 24px; color: #2a9d8f;">Welcome to Solar Vipani</h1>
                </div>
                <div style="margin: 20px 0;">
                    <p>Dear ${businessname},</p>
                    <p>Congratulations and welcome to <strong>Solar Vipani</strong>! We’re excited to inform you that your business listing has successfully passed our verification process and is now live on our platform.</p>
                    
                    <h2>Access your Account</h2>
                    <p>To get started, click on the link below:</p>
                    <p>
                        <a href="https://solarvipani.com/business/${slug}/signin-link/${magic_link_token}" 
                        style="background-color: #2a9d8f; color: #ffffff !important; text-decoration: none !important; 
                                font-weight: bold; font-size: 1.2em; padding: 12px 20px; border-radius: 5px; 
                                display: inline-block; text-align: center;">
                        Solar Vipani Business Portal
                        </a>
                    </p>
                    <p>Once signed in, you can update your business information — such as phone number, email, website, and address — to keep your listing current and relevant.</p>
                    
                    <h2>Immediate Next Steps:</h2>
                    <ol>
                        <li><strong>Add Your Branch Locations</strong>
                            <ul>
                                <li>List all the locations where you operate</li>
                                <li>Help customers find you locally</li>
                                <li>Increase visibility in multiple areas</li>
                            </ul>
                        </li>
                        <li><strong>Post Recent Projects</strong>
                            <ul>
                                <li>Showcase your work with photos</li>
                                <li>Build credibility with potential customers</li>
                                <li>Get higher ranking in search results</li>
                            </ul>
                        </li>
                    </ol>
                    
                    <h2>By listing with Solar Vipani, you gain access to several valuable benefits:</h2>
                    <ul>
                        <li><strong>Increase Visibility</strong>: Reach a wider audience of potential customers searching for solar panel installers.</li>
                        <li><strong>Enhance Online Presence</strong>: Improve your digital footprint with a dedicated business profile.</li>
                        <li><strong>Direct Customer Inquiries</strong>: Receive direct messages from interested customers through our platform.</li>
                        <li><strong>Manage Your Information</strong>: Keep your business details up-to-date to ensure customers have the latest information.</li>
                        <li><strong>Strengthen Credibility</strong>: Showcase your expertise and services to build trust with potential clients.</li>
                    </ul>

                    <p>
                        <a href="https://solarvipani.com/solar-panel-installer/${slug}" 
                        style="background-color: #2a9d8f; color: #ffffff !important; text-decoration: none !important; 
                                font-weight: bold; font-size: 1.2em; padding: 12px 20px; border-radius: 5px; 
                                display: inline-block; text-align: center;">
                        View Your Business Listing
                        </a>
                    </p>
                    <p>Thank you for joining the <strong>Solar Vipani</strong> community! If you have any questions or need further assistance, feel free to reach out to our support team at <a href="mailto:admin@solarvipani.com">admin@solarvipani.com</a>.</p>
                </div>
                <div style="margin-top: 20px; font-size: 12px; text-align: center; color: #777;">
                    <p>Solar Vipani<br>
                    <a href="https://solarvipani.com">https://solarvipani.com</a> | 
                    <a href="mailto:admin@solarvipani.com">admin@solarvipani.com</a></p>
                </div>
            </div>
        </body>
        </html>


    `;

		// Send the welcome email to both the admin and the business email
		await sendEmail([adminEmail, businessEmail], subject, message, { isHtml: true });

		return json({ success: true });
	} catch (error) {
		console.error('Error sending welcome mail:', error);
		return json({ success: false, error: 'Failed to send welcome mail' }, { status: 500 });
	}
}
