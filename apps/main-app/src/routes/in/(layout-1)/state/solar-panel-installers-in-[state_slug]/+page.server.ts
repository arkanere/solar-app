import type { PageServerLoad } from './$types';
import { pool } from '$lib/server/db';
import { slugToName, mostRecentDate } from '$lib/server/format';

export const config = {
	isr: {
		expiration: 86400
	}
};

export const load: PageServerLoad = async ({ params }) => {
	const stateSlug = params.state_slug;

	let stateName = '';
	if (stateSlug.startsWith('solar-panel-installers-in-')) {
		stateName = stateSlug.replace('solar-panel-installers-in-', '');
	} else {
		stateName = stateSlug;
	}

	if (!stateName) {
		return {
			state: '',
			errorMessage: 'Invalid state URL format'
		};
	}

	const stateFormatted = slugToName(stateName);

	try {
		const districtsResult = await pool.query(
			`
      SELECT DISTINCT district
      FROM locations
      WHERE LOWER(state) = LOWER($1)
      ORDER BY district ASC
      `,
			[stateFormatted]
		);

		const districts = districtsResult.rows.map((row) => row.district);

		const districtCountsResult = await pool.query(
			`
			SELECT LOWER(district) as district, COUNT(*) as count
			FROM businesses_1
			WHERE LOWER(state) = LOWER($1) AND isvisible = true
			GROUP BY LOWER(district)
			`,
			[stateFormatted]
		);

		const districtInstallerCounts: Record<string, number> = {};
		for (const row of districtCountsResult.rows) {
			districtInstallerCounts[row.district] = Number(row.count);
		}

		const statsResult = await pool.query(
			`
			SELECT
				COUNT(*) as installer_count,
				MAX(created_at) as latest_installer_added
			FROM businesses_1
			WHERE LOWER(state) = LOWER($1) AND isvisible = true
			`,
			[stateFormatted]
		);

		const latestProjectResult = await pool.query(
			`
			SELECT MAX(p.project_date) as latest_project_date
			FROM projects p
			JOIN businesses_1 b ON p.business_slug = b.slug
			WHERE LOWER(b.state) = LOWER($1) AND p.isvisible = true
			`,
			[stateFormatted]
		);

		const installerCount = Number(statsResult.rows[0]?.installer_count || 0);
		const latestInstallerAdded = statsResult.rows[0]?.latest_installer_added || null;
		const latestProjectDate = latestProjectResult.rows[0]?.latest_project_date || null;

		const lastUpdated = mostRecentDate([latestInstallerAdded, latestProjectDate]);

		if (districts.length > 0) {
			return {
				state: stateFormatted,
				districts,
				districtInstallerCounts,
				installerCount,
				latestProjectDate,
				lastUpdated
			};
		} else {
			const stateCheckResult = await pool.query(
				`
        SELECT DISTINCT state
        FROM locations
        WHERE LOWER(state) = LOWER($1)
        LIMIT 1
        `,
				[stateFormatted]
			);

			if (stateCheckResult.rows.length > 0) {
				return {
					state: stateFormatted,
					errorMessage: `No districts found in ${stateFormatted}.`
				};
			} else {
				return {
					state: stateFormatted,
					errorMessage: `${stateFormatted} is not a recognized state or we don't have coverage in this area yet.`
				};
			}
		}
	} catch (error) {
		console.error('Database query error:', error);
		return {
			state: stateFormatted,
			errorMessage: 'Failed to load solar panel installers'
		};
	}
}
