import { json, type RequestHandler } from '@sveltejs/kit';
import { POSTGRES_URL } from '$env/static/private';
import { createPool } from '@vercel/postgres';

const pool = createPool({ connectionString: POSTGRES_URL });

export const GET: RequestHandler = async ({ params }) => {
	try {
		const { business_slug } = params;

		if (!business_slug) {
			return json({ 
				success: false, 
				message: 'Business slug is required' 
			}, { status: 400 });
		}

		const client = await pool.connect();
		
		try {
			// First, get the main business using the slug
			const mainBusinessResult = await client.query(
				'SELECT * FROM businesses_1 WHERE slug = $1 LIMIT 1',
				[business_slug]
			);

			if (mainBusinessResult.rows.length === 0) {
				return json({ 
					success: false, 
					message: 'Business not found' 
				}, { status: 404 });
			}

			const mainBusiness = mainBusinessResult.rows[0];

			// Get all visible projects for this business
			const projectsResult = await client.query(`
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
				WHERE business_slug = $1 AND (isvisible = TRUE OR isvisible IS NULL)
				ORDER BY project_date DESC, created_at DESC
			`, [business_slug]);

			const projects = projectsResult.rows;

			// Format the response data
			const formatBusiness = (business) => ({
				id: business.id,
				businessname: business.businessname,
				slug: business.slug,
				address: business.address,
				city: business.city,
				district: business.district,
				state: business.state,
				phonenumber: business.phonenumber,
				email: business.email
			});

			const formatProject = (project) => ({
				id: project.id,
				business_slug: project.business_slug,
				project_slug: project.project_slug,
				title: project.title,
				pincode: project.pincode,
				district: project.district,
				project_date: project.project_date,
				created_at: project.created_at,
				image_url: project.image_url,
				cloudinary_public_id: project.cloudinary_public_id,
				image_width: project.image_width,
				image_height: project.image_height,
				image_format: project.image_format
			});

			return json({
				success: true,
				mainBusiness: formatBusiness(mainBusiness),
				projects: projects.map(project => formatProject(project))
			});

		} catch (error) {
			console.error('Database query error:', error);
			return json({ 
				success: false, 
				message: 'Internal server error' 
			}, { status: 500 });
		} finally {
			client.release();
		}

	} catch (error) {
		console.error('Get projects API error:', error);
		return json({ 
			success: false, 
			message: 'Invalid request' 
		}, { status: 400 });
	}
}