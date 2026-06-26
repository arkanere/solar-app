import { createPool } from '@vercel/postgres';
import { env } from '$env/dynamic/private';
import { PUBLIC_CLOUDINARY_CLOUD_NAME } from '$env/static/public';
import { json, type RequestHandler } from '@sveltejs/kit';
import { v2 as cloudinary } from 'cloudinary';

// Allow headroom for Cloudinary deletes when a batch of old leads has bills.
export const config = { maxDuration: 60 };

// 6-month retention purge (PII compliance plan, item 5).
//
// Triggered monthly by an external Cronicle job:
//   curl -X POST https://solarvipani.com/api/cron/purge-old-leads \
//        -H "Authorization: Bearer $CRON_SECRET"
//
// Only unclaimed leads (category = 1) are purged. Claimed leads (category = 2)
// belong to the business actively working them and are retained.

interface PurgeRow {
	bill_cloudinary_public_id: string | null;
}

export const POST: RequestHandler = async ({ request }) => {
	const expected = env.CRON_SECRET;
	const provided = request.headers.get('authorization');

	if (!expected || provided !== `Bearer ${expected}`) {
		return json({ success: false, error: 'Unauthorized' }, { status: 401 });
	}

	const pool = createPool({ connectionString: env.POSTGRES_URL });

	try {
		// Delete old unclaimed leads, returning any associated Cloudinary bill ids
		// so the underlying files can be removed too.
		const result = await pool.query<PurgeRow>(
			`DELETE FROM leaddata
			 WHERE created_at < NOW() - INTERVAL '6 months'
			   AND category = 1
			 RETURNING bill_cloudinary_public_id`
		);

		const deletedLeads = result.rowCount ?? 0;
		const publicIds = result.rows
			.map((r) => r.bill_cloudinary_public_id)
			.filter((id): id is string => !!id);

		let deletedFiles = 0;
		if (publicIds.length > 0 && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET) {
			cloudinary.config({
				cloud_name: PUBLIC_CLOUDINARY_CLOUD_NAME,
				api_key: env.CLOUDINARY_API_KEY,
				api_secret: env.CLOUDINARY_API_SECRET,
				secure: true
			});

			for (const publicId of publicIds) {
				try {
					// Bills are stored as `authenticated`; older bills may be public
					// `upload` assets, so fall back to that type if not found.
					let res = await cloudinary.uploader.destroy(publicId, {
						type: 'authenticated',
						resource_type: 'image'
					});
					if (res?.result === 'not found') {
						res = await cloudinary.uploader.destroy(publicId);
					}
					if (res?.result === 'ok') deletedFiles += 1;
				} catch (cloudinaryError) {
					console.error('Error deleting bill from Cloudinary:', publicId, cloudinaryError);
				}
			}
		}

		return json({ deleted_leads: deletedLeads, deleted_files: deletedFiles });
	} catch (error) {
		console.error('Error purging old leads:', error);
		return json({ success: false, error: 'Failed to purge old leads' }, { status: 500 });
	}
};
