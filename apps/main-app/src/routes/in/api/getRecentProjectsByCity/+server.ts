// /api/getRecentProjectsByCity/+server.js
import { json, type RequestHandler } from '@sveltejs/kit';
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';

const pool = createPool({ connectionString: POSTGRES_URL });

export const GET: RequestHandler = async ({ url }) => {
	const cityParam = url.searchParams.get('city');
	const limit = url.searchParams.get('limit') || 6;

	if (!cityParam) {
		return json({ success: false, error: 'City parameter is required' }, { status: 400 });
	}

	const citySlug = cityParam.toLowerCase();

	try {
		const client = await pool.connect();

		try {
			const districtResult = await client.query(
				`SELECT city, district FROM locations
				WHERE LOWER(REGEXP_REPLACE(city, '\\s+', '-', 'g')) = $1
				LIMIT 1`,
				[citySlug]
			);

			if (districtResult.rows.length === 0) {
				return json(
					{
						success: false,
						error: `No district found for city: ${citySlug}`
					},
					{ status: 404 }
				);
			}

			const city = districtResult.rows[0].city;
			const district = districtResult.rows[0].district;

			// Query all projects from the district
			const query = `
        SELECT 
          id, 
          business_slug, 
          project_slug,
          title, 
          pincode, 
          project_date, 
          created_at,
          image_url,
          cloudinary_public_id,
          image_width,
          image_height,
          image_format,
          district
        FROM projects 
        WHERE district = $1 AND isvisible = true
        ORDER BY 
          project_date DESC,
          created_at DESC
        LIMIT $2
      `;

			const result = await client.query(query, [district, limit]);

			return json({
				success: true,
				projects: result.rows,
				metadata: {
					city: city,
					district: district,
					total_count: result.rowCount
				}
			});
		} catch (queryError: any) {
			return json(
				{
					success: false,
					error: 'Database query error: ' + queryError.message
				},
				{ status: 500 }
			);
		} finally {
			client.release();
		}
	} catch (connectionError: any) {
		return json(
			{
				success: false,
				error: 'Database connection error: ' + connectionError.message
			},
			{ status: 500 }
		);
	}
}
