import type { PageServerLoad } from './$types';
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
export const config = {
	isr: {
		expiration: 86400 // 24 hours
	}
};


export const load: PageServerLoad = async ({ params }) => {
	const districtSlug = params.district_slug; // The district slug from the URL

	if (!districtSlug) {
		return {
			user: null,
			district: '',
			errorMessage: 'Invalid district URL format'
		};
	}

	// Format the district name properly (capitalize each word)
	const districtFormatted = districtSlug
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');

	const pool = createPool({ connectionString: POSTGRES_URL });

	try {
		// Query to get all cities from the specified district
		const citiesResult = await pool.query(
			`
      SELECT DISTINCT city
      FROM locations 
      WHERE LOWER(district) = LOWER($1) 
      ORDER BY city ASC
      `,
			[districtFormatted]
		);

		const cities = citiesResult.rows.map((row) => row.city);

		// Query installer count and latest activity for this district
		const statsResult = await pool.query(
			`
			SELECT
				COUNT(*) as installer_count,
				MAX(created_at) as latest_installer_added
			FROM businesses_1
			WHERE LOWER(district) = LOWER($1) AND isvisible = true
			`,
			[districtFormatted]
		);

		const latestProjectResult = await pool.query(
			`
			SELECT MAX(p.project_date) as latest_project_date
			FROM projects p
			JOIN businesses_1 b ON p.business_slug = b.slug
			WHERE LOWER(b.district) = LOWER($1) AND p.isvisible = true
			`,
			[districtFormatted]
		);

		const installerCount = Number(statsResult.rows[0]?.installer_count || 0);
		const latestInstallerAdded = statsResult.rows[0]?.latest_installer_added || null;
		const latestProjectDate = latestProjectResult.rows[0]?.latest_project_date || null;

		// lastUpdated is the most recent real data change
		const candidates = [latestInstallerAdded, latestProjectDate].filter(Boolean).map((d) => new Date(d));
		const lastUpdated = candidates.length > 0 ? new Date(Math.max(...candidates.map((d) => d.getTime()))).toISOString() : null;

		// Return cities from the district
		if (cities.length > 0) {
			return {
				user: null,
				district: districtFormatted,
				cities: cities,
				installerCount,
				latestProjectDate,
				lastUpdated
			};
		} else {
			// Check if the district exists in our database
			const districtCheckResult = await pool.query(
				`
        SELECT DISTINCT district
        FROM locations 
        WHERE LOWER(district) = LOWER($1) 
        LIMIT 1
        `,
				[districtFormatted]
			);

			if (districtCheckResult.rows.length > 0) {
				return {
					user: null,
					district: districtFormatted,
					cities: [],
					errorMessage: `No cities found in ${districtFormatted}.`
				};
			} else {
				return {
					user: null,
					district: districtFormatted,
					cities: [],
					errorMessage: `${districtFormatted} is not a recognized district or we don't have coverage in this area yet.`
				};
			}
		}
	} catch (error) {
		console.error('Database query error:', error);
		return {
			user: null,
			district: districtFormatted,
			cities: [],
			errorMessage: 'Failed to load cities'
		};
	}
}