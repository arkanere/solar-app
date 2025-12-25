import { json } from '@sveltejs/kit';
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } from '$env/static/private';
import { PUBLIC_CLOUDINARY_CLOUD_NAME } from '$env/static/public';

// Configure Cloudinary
cloudinary.config({
	cloud_name: PUBLIC_CLOUDINARY_CLOUD_NAME,
	api_key: CLOUDINARY_API_KEY,
	api_secret: CLOUDINARY_API_SECRET,
	secure: true
});

const pool = createPool({ connectionString: POSTGRES_URL });

export async function DELETE({ request, cookies }) {
	try {
		// Validate session and authorization
		const { BusinessAuthService } = await import('$lib/in/auth/business/index.js');
		const authService = new BusinessAuthService();
		const sessionResult = authService.validateSession(cookies);

		if (!sessionResult.success) {
			return json({ success: false, error: 'Unauthorized - Please login' }, { status: 401 });
		}

		const { projectId, business_slug } = await request.json();

		// Validate required fields
		if (!projectId || !business_slug) {
			return json(
				{ success: false, error: 'Project ID and business slug are required' },
				{ status: 400 }
			);
		}

		// Verify the logged-in business owns this project
		if (sessionResult.session.businessSlug !== business_slug) {
			return json(
				{ success: false, error: 'Forbidden - You can only delete your own projects' },
				{ status: 403 }
			);
		}

		const client = await pool.connect();

		try {
			// First, get the project details to check ownership and get Cloudinary public_id
			const projectResult = await client.query(
				'SELECT business_slug, cloudinary_public_id FROM projects WHERE id = $1',
				[projectId]
			);

			if (projectResult.rows.length === 0) {
				return json({ success: false, error: 'Project not found' }, { status: 404 });
			}

			const project = projectResult.rows[0];

			// Verify ownership
			if (project.business_slug !== business_slug) {
				return json(
					{ success: false, error: 'Forbidden - This project belongs to another business' },
					{ status: 403 }
				);
			}

			// Delete image from Cloudinary if it exists
			if (project.cloudinary_public_id) {
				try {
					await cloudinary.uploader.destroy(project.cloudinary_public_id);
					console.log('Deleted image from Cloudinary:', project.cloudinary_public_id);
				} catch (cloudinaryError) {
					console.error('Error deleting from Cloudinary:', cloudinaryError);
					// Continue with database deletion even if Cloudinary deletion fails
				}
			}

			// Delete the project from database
			const deleteResult = await client.query('DELETE FROM projects WHERE id = $1 RETURNING id', [
				projectId
			]);

			if (deleteResult.rows.length === 0) {
				return json({ success: false, error: 'Failed to delete project' }, { status: 500 });
			}

			console.log('Project deleted successfully:', projectId);

			return json({
				success: true,
				message: 'Project deleted successfully'
			});
		} finally {
			client.release();
		}
	} catch (error) {
		console.error('Error deleting project:', error);
		return json(
			{ success: false, error: 'Internal server error: ' + error.message },
			{ status: 500 }
		);
	}
}
