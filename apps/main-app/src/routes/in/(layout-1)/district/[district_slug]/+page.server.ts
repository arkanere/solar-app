import type { PageServerLoad } from './$types';
import { pool } from '$lib/server/db';
import { slugToName, mostRecentDate } from '$lib/server/format';

export const config = {
	isr: {
		expiration: 86400
	}
};

export const load: PageServerLoad = async ({ params }) => {
	const districtSlug = params.district_slug;

	if (!districtSlug) {
		return {
			district: '',
			errorMessage: 'Invalid district URL format'
		};
	}

	const districtFormatted = slugToName(districtSlug);

	try {
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

		const lastUpdated = mostRecentDate([latestInstallerAdded, latestProjectDate]);

		if (cities.length > 0) {
			return {
				district: districtFormatted,
				cities,
				installerCount,
				latestProjectDate,
				lastUpdated
			};
		} else {
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
					district: districtFormatted,
					cities: [],
					errorMessage: `No cities found in ${districtFormatted}.`
				};
			} else {
				return {
					district: districtFormatted,
					cities: [],
					errorMessage: `${districtFormatted} is not a recognized district or we don't have coverage in this area yet.`
				};
			}
		}
	} catch (error) {
		console.error('Database query error:', error);
		return {
			district: districtFormatted,
			cities: [],
			errorMessage: 'Failed to load cities'
		};
	}
}
