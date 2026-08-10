import { json } from '@sveltejs/kit';
import { and, eq, sql } from 'drizzle-orm';
import { schema } from '@solar/db';
import { db } from '$lib/server/db';
import { UserAuthService } from '$lib/auth/user';
import { uploadBill, getSignedBillUrl, deleteBill } from '$lib/server/billStorage';
import type { RequestHandler } from './$types';

const allowedFileTypes = [
	'image/jpeg',
	'image/jpg',
	'image/png',
	'image/webp',
	'image/gif',
	'image/bmp',
	'image/tiff',
	'application/pdf'
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/** The `leads` projection row both lookup branches below select. */
interface LeadRow {
	id: number;
	bill_cloudinary_public_id: string | null;
}

// Since 066 this reads leaddata.id directly, which is the primary key and NOT
// NULL, so the `sql<number>` restatement that used to sit here for the nullable
// leads.source_id is gone.
const LEAD_SELECTION = {
	id: schema.leaddata.id,
	bill_cloudinary_public_id: schema.leaddata.billCloudinaryPublicId
};

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const contentType = request.headers.get('content-type') || '';
		if (!contentType.includes('multipart/form-data')) {
			return json({ success: false, error: 'Unsupported content type' }, { status: 400 });
		}

		const formData = await request.formData();
		const billFile = formData.get('billFile');
		const ref = formData.get('ref');
		const leadId = formData.get('leadId');

		if (!billFile || typeof billFile === 'string' || billFile.size === 0) {
			return json({ success: false, error: 'Bill file is required' }, { status: 400 });
		}

		if (!allowedFileTypes.includes(billFile.type)) {
			return json(
				{ success: false, error: 'Please upload an image (JPG, PNG, WebP, GIF, BMP, TIFF) or PDF file' },
				{ status: 400 }
			);
		}

		if (billFile.size > MAX_FILE_SIZE) {
			return json({ success: false, error: 'File size must be less than 10MB' }, { status: 400 });
		}

		// Locate the lead: either via reference uuid (thank-you page)
		// or via lead id + authenticated session (dashboard)
		let lead: LeadRow | null = null;

		if (ref) {
			const rows = await db
				.select(LEAD_SELECTION)
				.from(schema.leaddata)
				.where(
					and(
						eq(schema.leaddata.countryCode, 'in'),
						eq(schema.leaddata.referenceUuid, String(ref)),
						eq(schema.leaddata.isvisible, true)
					)
				)
				.limit(1);
			lead = rows[0] || null;
		} else if (leadId) {
			const authService = new UserAuthService();
			const sessionResult = authService.validateSession(cookies);

			if (!sessionResult.success) {
				return json({ success: false, error: 'Unauthorized - Please sign in' }, { status: 401 });
			}

			const rows = await db
				.select(LEAD_SELECTION)
				.from(schema.leaddata)
				.where(
					and(
						eq(schema.leaddata.countryCode, 'in'),
						eq(schema.leaddata.id, Number(leadId)),
						eq(schema.leaddata.email, sessionResult.user.email),
						eq(schema.leaddata.isvisible, true)
					)
				)
				.limit(1);
			lead = rows[0] || null;
		} else {
			return json({ success: false, error: 'Lead reference is required' }, { status: 400 });
		}

		if (!lead) {
			return json({ success: false, error: 'Inquiry not found' }, { status: 404 });
		}

		const billData = await uploadBill(billFile);

		// Remove the previously uploaded bill, if any
		if (lead.bill_cloudinary_public_id) {
			await deleteBill(lead.bill_cloudinary_public_id);
		}

		// bill_url stores the (non-public) authenticated delivery URL for reference;
		// users are always served a freshly-signed, time-limited URL generated from
		// the public id when a bill is read back.
		const signedUrl = getSignedBillUrl(billData.publicId, billData.format);

		await db
			.update(schema.leaddata)
			.set({
				billUrl: signedUrl,
				billCloudinaryPublicId: billData.publicId,
				billFormat: billData.format,
				// `sql` escape hatch: bill_uploaded_at is a mode:'string' timestamp,
				// and NOW() keeps the clock on the database as the raw SQL did.
				billUploadedAt: sql`NOW()`
			})
			.where(eq(schema.leaddata.id, lead.id));

		return json({
			success: true,
			billUrl: signedUrl,
			billFormat: billData.format
		});
	} catch (error) {
		console.error('Error uploading electricity bill:', error);
		return json({ success: false, error: 'Failed to upload bill. Please try again.' }, { status: 500 });
	}
};
