// /api/getRecentProjects/+server.js
import { json } from '@sveltejs/kit';
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';

const pool = createPool({ connectionString: POSTGRES_URL });

export async function GET({ url }) {
	const businessSlug = url.searchParams.get('business_slug');
	const limit = url.searchParams.get('limit') || 10; // Default to 10 recent projects

	if (!businessSlug) {
		return json({ success: false, error: 'Business slug is required' }, { status: 400 });
	}

	try {
		const client = await pool.connect();

		try {
			// Extract main business slug by removing branch suffix if present
			// Pattern: 'mahati-enterprises-udupi-branch-d8311f53' -> 'mahati-enterprises-udupi'
			let mainBusinessSlug = businessSlug;

			// Check if this is a branch slug (contains '-branch-' followed by alphanumeric characters)
			const branchPattern = /-branch-[a-zA-Z0-9]+$/;
			if (branchPattern.test(businessSlug)) {
				// Remove the branch suffix to get the main business slug
				mainBusinessSlug = businessSlug.replace(branchPattern, '');
			}

			// Query projects for the main business slug only
			const query = `
        SELECT 
          id, 
          business_slug, 
          project_slug,
          title, 
          pincode, 
          district,
          project_date, 
          created_at,
          image_url,
          cloudinary_public_id,
          image_width,
          image_height,
          image_format
        FROM projects 
        WHERE business_slug = $1
        AND (isvisible = TRUE OR isvisible IS NULL)
        ORDER BY project_date DESC, created_at DESC
        LIMIT $2
      `;

			const result = await client.query(query, [mainBusinessSlug, limit]);

			return json({
				success: true,
				projects: result.rows,
				metadata: {
					main_business_slug: mainBusinessSlug,
					requested_slug: businessSlug,
					total_count: result.rowCount
				},
				debug: {
					timestamp: new Date().toISOString(),
					query_executed: `Query for main business '${mainBusinessSlug}'`,
					parameters: [mainBusinessSlug, limit],
					hasResults: result.rows.length > 0
				}
			});
		} catch (queryError) {
			console.error('Database query error:', queryError);
			return json(
				{
					success: false,
					error: 'Database query error: ' + queryError.message,
					debug: {
						message: queryError.message,
						code: queryError.code
					}
				},
				{ status: 500 }
			);
		} finally {
			client.release();
		}
	} catch (connectionError) {
		console.error('Database connection error:', connectionError);
		return json(
			{
				success: false,
				error: 'Database connection error: ' + connectionError.message,
				debug: {
					message: connectionError.message,
					code: connectionError.code
				}
			},
			{ status: 500 }
		);
	}
}
