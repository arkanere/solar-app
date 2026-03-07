import type { PageServerLoad } from './$types';
import { pool } from '$lib/server/db';
import { error } from '@sveltejs/kit';

export const config = {
	isr: { expiration: 604800 }
};

export const load: PageServerLoad = async ({ params }) => {
	const projectSlug = params.project_id.toLowerCase();

	const result = await pool.query(
		`SELECT
			p.id as project_id,
			p.title as project_title,
			p.pincode,
			p.district as project_district,
			p.city as project_city,
			p.project_date,
			p.cloudinary_public_id,
			p.image_url,
			p.project_slug,
			b.businessname,
			b.slug as business_slug,
			b.city as business_city,
			b.district as business_district,
			b.state as business_state,
			b.phonenumber
		 FROM projects p
		 INNER JOIN businesses_1 b ON p.business_slug = b.slug
		 WHERE p.project_slug = $1
		   AND p.isvisible = true
		   AND b.isvisible = true`,
		[projectSlug]
	);

	if (result.rows.length === 0) {
		error(404, 'Project not found');
	}

	const row = result.rows[0];

	const district = row.project_district || row.business_district;
	const stateSlug = row.business_state?.toLowerCase().replace(/ /g, '-') || '';
	const districtSlug = district?.toLowerCase().replace(/ /g, '-') || '';

	return {
		project: {
			id: row.project_id,
			title: row.project_title,
			pincode: row.pincode,
			district,
			city: row.project_city,
			project_date: row.project_date,
			cloudinary_public_id: row.cloudinary_public_id,
			image_url: row.image_url,
			slug: row.project_slug
		},
		business: {
			businessname: row.businessname,
			slug: row.business_slug,
			city: row.business_city,
			district: row.business_district,
			state: row.business_state,
			phonenumber: row.phonenumber
		},
		stateSlug,
		districtSlug
	};
};
