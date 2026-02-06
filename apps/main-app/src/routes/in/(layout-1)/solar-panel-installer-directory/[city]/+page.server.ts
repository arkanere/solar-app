import type { PageServerLoad } from './$types';
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
export const config = {
	isr: {
		expiration: 604800 // 7 days
	}
};


export const load: PageServerLoad = async ({ params }) => {
	const cityParam = params.city; // The city from the URL (e.g., "dallas")

	// Utility function to capitalize city names
	function capitalizeCityName(city: string) {
		return city
			.split(/([\s-])/g) // Split on spaces or hyphens while keeping the delimiters
			.map((part, _) => {
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
				lastUpdated: new Date().toISOString(),
				user: null
			};
		}

		const district = districtResult.rows[0].district;

		// Fetch businesses (sorting deferred to transformation layer)
		const districtBusinessesResult = await pool.query(
			`SELECT businessname, description, phonenumber, slug, address, pluscode, state, city, tag, rscore, businessfilled, services
      FROM businesses_1
      WHERE district = $1 AND isvisible = true`,
			[district]
		);

		const businesses = districtBusinessesResult.rows;

		// Fetch recent projects for each business (max 3 per business)
		const businessSlugs = businesses.map((b) => b.slug);
		let businessProjectsMap = new Map();

		if (businessSlugs.length > 0) {
			const projectsByBusinessResult = await pool.query(
				`SELECT
					business_slug,
					project_slug,
					title,
					image_url,
					cloudinary_public_id,
					image_width,
					image_height,
					image_format,
					project_date
				FROM (
					SELECT *,
						ROW_NUMBER() OVER (PARTITION BY business_slug ORDER BY project_date DESC, created_at DESC) as rn
					FROM projects
					WHERE business_slug = ANY($1) AND isvisible = true
				) ranked
				WHERE rn <= 3`,
				[businessSlugs]
			);

			// Group projects by business_slug
			projectsByBusinessResult.rows.forEach((project) => {
				if (!businessProjectsMap.has(project.business_slug)) {
					businessProjectsMap.set(project.business_slug, []);
				}
				businessProjectsMap.get(project.business_slug).push(project);
			});
		}

		// Transform: attach projects and re-sort by relevance
		const businessesWithProjects = businesses
			.map((business) => ({
				...business,
				recent_projects: businessProjectsMap.get(business.slug) || []
			}))
			.sort((a, b) => {
				// Pure function sort: city match → project count → score
				const aCityMatch = a.city === city ? 0 : 1;
				const bCityMatch = b.city === city ? 0 : 1;
				if (aCityMatch !== bCityMatch) return aCityMatch - bCityMatch;

				const aProjectCount = a.recent_projects.length;
				const bProjectCount = b.recent_projects.length;
				if (aProjectCount !== bProjectCount) return bProjectCount - aProjectCount;

				return (b.rscore || 0) - (a.rscore || 0);
			});

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
		if (businessesWithProjects.length > 0) {
			return {
				city,
				district,
				businesses: businessesWithProjects,
				subset_cities_localities,
				recentProjects,
				lastUpdated: new Date().toISOString(),
				user: null
			};
		} else {
			return {
				city,
				district,
				subset_cities_localities,
				recentProjects,
				lastUpdated: new Date().toISOString(),
				errorMessage: `No businesses found in ${city} or its district: ${district}.`,
				user: null
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
			lastUpdated: new Date().toISOString(),
			user: null
		};
	}
}
