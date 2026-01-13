// /api/getRecentProjectsByCity/+server.js
import { json, type RequestHandler } from '@sveltejs/kit';
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';

const pool = createPool({ connectionString: POSTGRES_URL });

// Utility function to capitalize city names
function capitalizeCityName(city: string): string {
	return city
		.split(/([\s-])/g) // Split on spaces or hyphens while keeping the delimiters
		.map((part) => {
			// If it's not a delimiter (i.e., it's a word), capitalize it
			if (!part.match(/[\s-]/)) {
				return part.charAt(0).toUpperCase() + part.slice(1);
			}
			// If it's a delimiter, return it unchanged
			return part;
		})
		.join(''); // Join back together, preserving original delimiters
}

export const GET: RequestHandler = async ({ url }) => {
	const cityParam = url.searchParams.get('city');
	const limit = url.searchParams.get('limit') || 6; // Default to 6 recent projects for city view

	if (!cityParam) {
		return json({ success: false, error: 'City parameter is required' }, { status: 400 });
	}

	// Capitalize the city name for proper database matching
	const city = capitalizeCityName(cityParam);

	try {
		const client = await pool.connect();

		try {
			// Get the district for the city using locations table
			const districtQuery = `
        SELECT district 
        FROM locations 
        WHERE city = $1 
        LIMIT 1
      `;

			const districtResult = await client.query(districtQuery, [city]);

			if (districtResult.rows.length === 0) {
				return json(
					{
						success: false,
						error: `No district found for city: ${city}`
					},
					{ status: 404 }
				);
			}

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
		} catch (queryError) {
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
	} catch (connectionError) {
		return json(
			{
				success: false,
				error: 'Database connection error: ' + connectionError.message
			},
			{ status: 500 }
		);
	}
}
