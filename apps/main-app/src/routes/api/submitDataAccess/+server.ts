import { db } from '$lib/server/db';
import { dataAccessRequests } from '@solar/db/schema';
import { json, type RequestHandler } from '@sveltejs/kit';
import { dataRequestSchema, parseBody } from '@solar/validation';
import { sendEmail } from '$lib/sendEmail';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const parsed = await parseBody(request, dataRequestSchema);
		if (!parsed.ok) {
			return json({ success: false, error: parsed.error, fields: parsed.fields }, { status: 400 });
		}
		const { email, phone, reason } = parsed.data;

		// created_at and status both have defaults matching the old literals
		// (defaultNow() and 'pending'), so neither is written explicitly.
		const inserted = await db
			.insert(dataAccessRequests)
			.values({ email, phone, reason })
			.returning({ id: dataAccessRequests.id });

		// Acknowledge the request — fulfillment itself is manual (team emails a CSV
		// within 30 days). Email failure must not fail the request submission.
		const subject = 'We received your data access request - Solar Vipani';
		const message = `
    <p>Hello,</p>
    <p>We have received your request to access the personal data we hold about you.</p>
    <p>Our team will review your request and email you a copy of your data within 30 days,
       in line with applicable data protection laws.</p>
    <p>If you have any questions, please contact us at
       <a href="mailto:admin@solarvipani.com">admin@solarvipani.com</a>.</p>
    <p>Best Regards,<br><strong>Solar Vipani Team</strong></p>
    `;
		try {
			await sendEmail([email, 'admin@solarvipani.com'], subject, message, { isHtml: true });
		} catch (emailError) {
			console.error('Error sending data access acknowledgement email:', emailError);
		}

		return json({
			success: true,
			id: inserted[0].id,
			message: 'Data access request submitted successfully'
		});
	} catch (error) {
		console.error('Error inserting data access request:', error);

		if (error instanceof Error && 'code' in error && error.code === '42P01') {
			return json(
				{ success: false, error: 'Database table not found. Please contact support.' },
				{ status: 500 }
			);
		}

		return json({ success: false, error: 'Failed to submit data access request' }, { status: 500 });
	}
};
