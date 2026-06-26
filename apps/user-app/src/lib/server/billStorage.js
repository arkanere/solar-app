import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } from '$env/static/private';
import { PUBLIC_CLOUDINARY_CLOUD_NAME } from '$env/static/public';

cloudinary.config({
	cloud_name: PUBLIC_CLOUDINARY_CLOUD_NAME,
	api_key: CLOUDINARY_API_KEY,
	api_secret: CLOUDINARY_API_SECRET,
	secure: true
});

// Electricity bills are stored as `authenticated` resources so the raw delivery
// URL is not publicly accessible. We hand the user a freshly-signed, time-limited
// URL each time we serve a bill back.
export const BILL_FOLDER = 'electricity-bills';
const SIGNED_URL_TTL_SECONDS = 60 * 60; // 1 hour

/**
 * Upload an electricity bill as a private (authenticated) Cloudinary asset.
 * @param {File} file
 * @returns {Promise<{ publicId: string, format: string }>}
 */
export async function uploadBill(file) {
	const buffer = Buffer.from(await file.arrayBuffer());
	const dataURI = `data:${file.type};base64,${buffer.toString('base64')}`;

	const result = await new Promise((resolve, reject) => {
		cloudinary.uploader.upload(
			dataURI,
			{
				folder: BILL_FOLDER,
				resource_type: 'auto',
				type: 'authenticated'
			},
			(error, uploadResult) => {
				if (error) reject(error);
				else resolve(uploadResult);
			}
		);
	});

	return {
		publicId: result.public_id,
		format: result.format
	};
}

/**
 * Generate a signed, time-limited delivery URL for a private bill asset.
 * Returns null when there is no stored bill. The URL expires after 1 hour;
 * accessing the asset without a valid signature returns 401 from Cloudinary.
 * @param {string | null | undefined} publicId
 * @param {string | null | undefined} [format]
 * @returns {string | null}
 */
export function getSignedBillUrl(publicId, format) {
	if (!publicId) return null;

	return cloudinary.url(publicId, {
		resource_type: 'image', // images and PDFs both deliver under the image resource type
		type: 'authenticated',
		format: format || undefined,
		sign_url: true,
		secure: true,
		expires_at: Math.floor(Date.now() / 1000) + SIGNED_URL_TTL_SECONDS
	});
}

/**
 * Delete a private bill asset from Cloudinary. Best-effort; never throws.
 * @param {string | null | undefined} publicId
 */
export async function deleteBill(publicId) {
	if (!publicId) return;
	try {
		await cloudinary.uploader.destroy(publicId, { type: 'authenticated', resource_type: 'image' });
	} catch (error) {
		console.error('Error deleting bill from Cloudinary:', error);
	}
}
