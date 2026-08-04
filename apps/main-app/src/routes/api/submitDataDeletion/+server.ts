import { db } from '$lib/server/db';
import { dataDeletionRequests } from '@solar/db/schema';
import { json, type RequestHandler } from '@sveltejs/kit';
import { sql } from 'drizzle-orm';
import { dataRequestSchema, parseBody } from '@solar/validation';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const parsed = await parseBody(request, dataRequestSchema);
		if (!parsed.ok) {
			return json({ success: false, error: parsed.error, fields: parsed.fields }, { status: 400 });
		}
		const { email, phone, reason } = parsed.data;

		// created_at defaults to CURRENT_TIMESTAMP, but the old INSERT wrote NOW()
		// explicitly; kept as an sql escape hatch so the value is still set by the
		// statement rather than relying on the column default.
		const inserted = await db
			.insert(dataDeletionRequests)
			.values({ email, phone, reason, createdAt: sql`NOW()`, status: 'pending' })
			.returning({ id: dataDeletionRequests.id });

		return json({
			success: true,
			id: inserted[0].id,
			message: 'Data deletion request submitted successfully'
		});
	} catch (error) {
		console.error('Error inserting data deletion request:', error);

		if (error instanceof Error && 'code' in error && error.code === '42P01') {
			return json(
				{
					success: false,
					error: 'Database table not found. Please contact support.'
				},
				{ status: 500 }
			);
		}

		return json(
			{
				success: false,
				error: 'Failed to submit data deletion request'
			},
			{ status: 500 }
		);
	}
};
