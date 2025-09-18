export const config = {
	isr: {
		expiration: 604800 // 7 days
	}
};

import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const cityParam = params.city; // The city from the URL (e.g., "dallas")

	// Utility function to capitalize city names
	function capitalizeCityName(city) {
		return city
			.split(/([\s-])/g) // Split on spaces or hyphens while keeping the delimiters
			.map((part, index) => {
				// If it's not a delimiter (i.e., it's a word), capitalize it
				if (!part.match(/[\s-]/)) {
					return part.charAt(0).toUpperCase() + part.slice(1);
				}
				// If it's a delimiter, return it unchanged
				return part;
			})
			.join(''); // Join back together, preserving original delimiters
	}
	// Capitalize the city name for proper database matching
	const city = capitalizeCityName(cityParam);

	const pool = createPool({ connectionString: POSTGRES_URL });

	try {
		// Directly query to find the district of the city (case-insensitive)
		const districtResult = await pool.query(
			`
      SELECT district 
      FROM locations 
      WHERE LOWER(city) = LOWER($1) 
      LIMIT 1
      `,
			[city]
		);

		// If no district is found, return an error message
		if (districtResult.rows.length === 0) {
			return { 
				city, 
				errorMessage: `No businesses found in ${city} or its district.`,
				subset_cities_localities: [],
				district: '',
				recentProjects: [],
				lastUpdated: new Date().toISOString()
			};
		}

		const district = districtResult.rows[0].district;

		// Modified query: Sort businesses from the requested city to the top,
		// then apply the existing sorting criteria within each group
		const districtBusinessesResult = await pool.query(
			`SELECT businessname, description, phonenumber, slug, address, pluscode, state, city, tag, rscore, businessfilled, tier3, services
      FROM businesses_1 
      WHERE district = $1 AND isvisible = true 
      ORDER BY 
        CASE WHEN city = $2 THEN 0 ELSE 1 END, -- Sort businesses from selected city first
        businessfilled DESC, 
        tier3 DESC, 
        rscore DESC;`,
			[district, city]
		);

		const businesses = districtBusinessesResult.rows;

		// Fetch all cities in the same district
		const citiesResult = await pool.query(
			`SELECT DISTINCT city
			FROM locations
			WHERE district = $1
			ORDER BY city ASC`,
			[district]
		);

		const subset_cities_localities = citiesResult.rows.map((row) => row.city);

		// Fetch recent projects for the district
		const projectsResult = await pool.query(
			`SELECT 
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
			LIMIT 6`,
			[district]
		);

		const recentProjects = projectsResult.rows;

		// Return businesses from the district along with the district name, cities, and projects
		if (businesses.length > 0) {
			return {
				city,
				district,
				businesses,
				subset_cities_localities,
				recentProjects,
				lastUpdated: new Date().toISOString()
			};
		} else {
			return {
				city,
				district,
				subset_cities_localities,
				recentProjects,
				lastUpdated: new Date().toISOString(),
				errorMessage: `No businesses found in ${city} or its district: ${district}.`
			};
		}
	} catch (error) {
		console.error('Database query error:', error);
		return { 
			city, 
			errorMessage: 'Failed to load businesses',
			subset_cities_localities: [],
			district: '',
			recentProjects: [],
			lastUpdated: new Date().toISOString()
		};
	}
}
