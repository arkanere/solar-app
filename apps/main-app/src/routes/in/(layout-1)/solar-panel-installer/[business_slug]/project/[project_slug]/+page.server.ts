// src/routes/solar-panel-installer/[business_slug]/project/[project_slug]/+page.server.js

import type { PageServerLoad } from './$types';
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { error } from '@sveltejs/kit';
export const config = {
	isr: {
		expiration: 86400 // 24 hours
	}
};


export const load: PageServerLoad = async ({ params }) => {
	const { business_slug, project_slug } = params;

	const pool = createPool({ connectionString: POSTGRES_URL });

	try {
		// Query to get both business and project information with district
		const result = await pool.query(
			`
      SELECT 
        p.id as project_id,
        p.title as project_title,
        p.pincode,
        p.district,
        p.city as project_city,
        p.project_date,
        p.cloudinary_public_id,
        p.image_url,
        p.project_slug,
        b.businessname,
        b.slug as business_slug,
        b.city as business_city
      FROM projects p
      INNER JOIN businesses_1 b ON p.business_slug = b.slug
      WHERE p.project_slug = $1 
        AND b.slug = $2 
        AND b.isvisible = true
        AND p.isvisible = true
    `,
			[project_slug, business_slug]
		);

		if (result.rows.length > 0) {
			const data = result.rows[0];

			return {
				project: {
					id: data.project_id,
					title: data.project_title,
					pincode: data.pincode,
					district: data.district,
					city: data.project_city,
					project_date: data.project_date,
					cloudinary_public_id: data.cloudinary_public_id,
					image_url: data.image_url,
					slug: data.project_slug
				},
				business: {
					businessname: data.businessname,
					slug: data.business_slug,
					city: data.business_city
				},
				user: null
			};
		} else {
			// Check if business exists but project doesn't
			const businessCheck = await pool.query(
				`
        SELECT businessname FROM businesses_1 
        WHERE slug = $1 AND isvisible = true
      `,
				[business_slug]
			);

			if (businessCheck.rows.length === 0) {
				throw error(404, 'Business not found');
			} else {
				throw error(404, 'Project not found');
			}
		}
	} catch (err: unknown) {
		if (typeof err === 'object' && err !== null && 'status' in err && typeof err.status === 'number') {
			throw error(err.status, 'Failed to load project details');
		}
		console.error('Database query error:', err);
		throw error(500, 'Failed to load project details');
	}
}
