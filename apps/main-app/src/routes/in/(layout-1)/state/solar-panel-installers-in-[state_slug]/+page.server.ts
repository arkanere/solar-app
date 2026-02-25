import type { PageServerLoad } from './$types';
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
export const config = {
	isr: {
		expiration: 86400 // 24 hours
	}
};


export const load: PageServerLoad = async ({ params }) => {
	const stateSlug = params.state_slug; // The state slug from the URL (e.g., "solar-panel-installers-in-maharashtra")

	// Extract the state name from the slug parameter directly
	let stateName = '';

	// Handle both formats: "state_slug" or fully formed "solar-panel-installers-in-state_slug"
	if (stateSlug.startsWith('solar-panel-installers-in-')) {
		stateName = stateSlug.replace('solar-panel-installers-in-', '');
	} else {
		stateName = stateSlug;
	}

	if (!stateName) {
		return {
			state: '',
			errorMessage: 'Invalid state URL format',
			user: null
		};
	}

	// Format the state name properly (capitalize each word)
	const stateFormatted = stateName
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');

	const pool = createPool({ connectionString: POSTGRES_URL });

	try {
		// Query to get all districts from the specified state
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

		// Query installer counts per district for this state
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

		// Query installer count and latest activity for this state
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

		// lastUpdated is the most recent real data change — whichever is newer
		const candidates = [latestInstallerAdded, latestProjectDate].filter(Boolean).map((d) => new Date(d));
		const lastUpdated = candidates.length > 0 ? new Date(Math.max(...candidates.map((d) => d.getTime()))).toISOString() : null;

		// Return districts from the state
		if (districts.length > 0) {
			return {
				state: stateFormatted,
				districts,
				districtInstallerCounts,
				installerCount,
				latestProjectDate,
				lastUpdated,
				user: null
			};
		} else {
			// Check if the state exists in our database
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
					errorMessage: `No districts found in ${stateFormatted}.`,
					user: null
				};
			} else {
				return {
					state: stateFormatted,
					errorMessage: `${stateFormatted} is not a recognized state or we don't have coverage in this area yet.`,
					user: null
				};
			}
		}
	} catch (error) {
		console.error('Database query error:', error);
		return {
			state: stateFormatted,
			errorMessage: 'Failed to load solar panel installers',
			user: null
		};
	}
}
