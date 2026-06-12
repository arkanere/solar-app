import { json } from '@sveltejs/kit';
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } from '$env/static/private';
import { PUBLIC_CLOUDINARY_CLOUD_NAME } from '$env/static/public';
import { v2 as cloudinary } from 'cloudinary';
import { UserAuthService } from '$lib/auth/user/index.js';

cloudinary.config({
	cloud_name: PUBLIC_CLOUDINARY_CLOUD_NAME,
	api_key: CLOUDINARY_API_KEY,
	api_secret: CLOUDINARY_API_SECRET,
	secure: true
});

const pool = createPool({ connectionString: POSTGRES_URL });

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

async function uploadBillToCloudinary(file) {
	const buffer = Buffer.from(await file.arrayBuffer());
	const dataURI = `data:${file.type};base64,${buffer.toString('base64')}`;

	const result = await new Promise((resolve, reject) => {
		cloudinary.uploader.upload(
			dataURI,
			{
				folder: 'electricity-bills',
				resource_type: 'auto'
			},
			(error, uploadResult) => {
				if (error) reject(error);
				else resolve(uploadResult);
			}
		);
	});

	return {
		url: result.secure_url,
		publicId: result.public_id,
		format: result.format
	};
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, cookies }) {
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
		let lead = null;

		if (ref) {
			const result = await pool.query(
				`SELECT id, bill_cloudinary_public_id FROM LeadData
				WHERE reference_uuid = $1 AND isvisible = true
				LIMIT 1`,
				[ref]
			);
			lead = result.rows[0] || null;
		} else if (leadId) {
			const authService = new UserAuthService();
			const sessionResult = authService.validateSession(cookies);

			if (!sessionResult.success) {
				return json({ success: false, error: 'Unauthorized - Please sign in' }, { status: 401 });
			}

			const result = await pool.query(
				`SELECT id, bill_cloudinary_public_id FROM LeadData
				WHERE id = $1 AND email = $2 AND isvisible = true
				LIMIT 1`,
				[leadId, sessionResult.user.email]
			);
			lead = result.rows[0] || null;
		} else {
			return json({ success: false, error: 'Lead reference is required' }, { status: 400 });
		}

		if (!lead) {
			return json({ success: false, error: 'Inquiry not found' }, { status: 404 });
		}

		const billData = await uploadBillToCloudinary(billFile);

		// Remove the previously uploaded bill, if any
		if (lead.bill_cloudinary_public_id) {
			try {
				await cloudinary.uploader.destroy(lead.bill_cloudinary_public_id);
			} catch (cloudinaryError) {
				console.error('Error deleting previous bill from Cloudinary:', cloudinaryError);
			}
		}

		await pool.query(
			`UPDATE LeadData
			SET bill_url = $1, bill_cloudinary_public_id = $2, bill_format = $3, bill_uploaded_at = NOW()
			WHERE id = $4`,
			[billData.url, billData.publicId, billData.format, lead.id]
		);

		return json({
			success: true,
			billUrl: billData.url,
			billFormat: billData.format
		});
	} catch (error) {
		console.error('Error uploading electricity bill:', error);
		return json({ success: false, error: 'Failed to upload bill. Please try again.' }, { status: 500 });
	}
}
