import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { projects } from '@solar/db/schema';
import { eq } from 'drizzle-orm';
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


export const DELETE: RequestHandler = async ({ request, cookies }) => {
	try {
		const { BusinessAuthService } = await import('$lib/in/auth/business');
		const authService = new BusinessAuthService();
		const sessionResult = authService.validateSession(cookies);

		if (!sessionResult.success) {
			return json({ success: false, error: 'Unauthorized - Please login' }, { status: 401 });
		}

		const { projectId, business_slug } = (await request.json()) as Record<string, any>;

		if (!projectId || !business_slug) {
			return json(
				{ success: false, error: 'Project ID and business slug are required' },
				{ status: 400 }
			);
		}

		if (sessionResult.session.businessSlug !== business_slug) {
			return json(
				{ success: false, error: 'Forbidden - You can only delete your own projects' },
				{ status: 403 }
			);
		}

		const [project] = await db
			.select({
				businessSlug: projects.businessSlug,
				cloudinaryPublicId: projects.cloudinaryPublicId
			})
			.from(projects)
			.where(eq(projects.id, Number(projectId)))
			.limit(1);

		if (!project) {
			return json({ success: false, error: 'Project not found' }, { status: 404 });
		}

		if (project.businessSlug !== business_slug) {
			return json(
				{ success: false, error: 'Forbidden - This project belongs to another business' },
				{ status: 403 }
			);
		}

		if (project.cloudinaryPublicId) {
			try {
				await cloudinary.uploader.destroy(project.cloudinaryPublicId);
				console.log('Deleted image from Cloudinary:', project.cloudinaryPublicId);
			} catch (cloudinaryError) {
				console.error('❌ Error deleting from Cloudinary:', cloudinaryError);
			}
		}

		const deleted = await db
			.delete(projects)
			.where(eq(projects.id, Number(projectId)))
			.returning({ id: projects.id });

		if (deleted.length === 0) {
			return json({ success: false, error: 'Failed to delete project' }, { status: 500 });
		}

		console.log('Project deleted successfully:', projectId);

		return json({
			success: true,
			message: 'Project deleted successfully'
		});
	} catch (error) {
		console.error('❌ Error deleting project:', error);
		return json(
			{ success: false, error: 'Internal server error: ' + (error instanceof Error ? error.message : String(error)) },
			{ status: 500 }
		);
	}
};
