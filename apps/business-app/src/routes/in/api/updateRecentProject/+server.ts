import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { pincodeMapping, projects } from '@solar/db/schema';
import { and, eq } from 'drizzle-orm';
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } from '$env/static/private';
import { PUBLIC_CLOUDINARY_CLOUD_NAME } from '$env/static/public';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with credentials
cloudinary.config({
	cloud_name: PUBLIC_CLOUDINARY_CLOUD_NAME,
	api_key: CLOUDINARY_API_KEY,
	api_secret: CLOUDINARY_API_SECRET,
	secure: true
});


interface CloudinaryUploadResult {
	url: string;
	publicId: string;
	width: number;
	height: number;
	format: string;
}

/**
 * Generate a URL-friendly slug from project title with random suffix
 */
function generateProjectSlug(title: string): string {
	let slug = title.toLowerCase();
	slug = slug.replace(/\./g, '_');
	slug = slug.replace(/[^a-z0-9_]/g, '-');
	slug = slug.replace(/-+/g, '-');
	slug = slug.replace(/^-+|-+$/g, '');

	const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
	let randomString = '';
	for (let i = 0; i < 6; i++) {
		randomString += characters.charAt(Math.floor(Math.random() * characters.length));
	}

	return slug + '-' + randomString;
}

/**
 * Upload file to Cloudinary
 */
async function uploadToCloudinary(file: File): Promise<CloudinaryUploadResult> {
	try {
		const buffer = Buffer.from(await file.arrayBuffer());
		const base64Data = buffer.toString('base64');
		const dataURI = `data:${file.type};base64,${base64Data}`;

		const result: any = await new Promise((resolve, reject) => {
			cloudinary.uploader.upload(
				dataURI,
				{
					folder: 'projects',
					resource_type: 'auto',
					transformation: [
						{ width: 1200, crop: 'limit' },
						{ quality: 'auto' }
					]
				},
				(error, result) => {
					if (error) reject(error);
					else resolve(result);
				}
			);
		});

		console.log('Image uploaded to Cloudinary:', result.secure_url);
		return {
			url: result.secure_url,
			publicId: result.public_id,
			width: result.width,
			height: result.height,
			format: result.format
		};
	} catch (error) {
		console.error('❌ Cloudinary upload error:', error);
		throw error;
	}
}

/**
 * Delete image from Cloudinary
 */
async function deleteFromCloudinary(publicId: string): Promise<void> {
	try {
		if (!publicId) return;

		await new Promise<void>((resolve, reject) => {
			cloudinary.uploader.destroy(publicId, (error) => {
				if (error) reject(error);
				else resolve();
			});
		});

		console.log('Image deleted from Cloudinary:', publicId);
	} catch (error) {
		console.error('❌ Cloudinary delete error:', error);
	}
}

export const PUT: RequestHandler = async ({ request, cookies }) => {
const { BusinessAuthService } = await import('$lib/in/auth/business');
		const authService = new BusinessAuthService();
		const sessionResult = authService.validateSession(cookies);

		if (!sessionResult.success) {
			return json({ success: false, error: 'Unauthorized - Please login' }, { status: 401 });
		}

		const contentType = request.headers.get('content-type') || '';

		let projectId: string | null = null;
		let projectTitle: string | null = null;
		let pincode: string | null = null;
		let projectDate: string | null = null;
		let business_slug: string | null = null;
		let removeImage = false;
		let imageData: CloudinaryUploadResult | null = null;

		if (contentType.includes('multipart/form-data')) {
			const formData = await request.formData();
			projectId = formData.get('projectId') as string | null;
			projectTitle = formData.get('projectTitle') as string | null;
			pincode = formData.get('pincode') as string | null;
			projectDate = formData.get('projectDate') as string | null;
			business_slug = formData.get('business_slug') as string | null;
			const projectImage = formData.get('projectImage') as File | null;
			removeImage = formData.get('removeImage') === 'true';

			if (projectImage && projectImage.size > 0) {
				try {
					imageData = await uploadToCloudinary(projectImage);
					console.log('Image uploaded successfully to Cloudinary');
				} catch (imageError) {
					console.error('Error uploading image to Cloudinary:', imageError);
					return json(
						{
							success: false,
							error: 'Failed to upload image: ' + (imageError instanceof Error ? imageError.message : String(imageError))
						},
						{ status: 500 }
					);
				}
			}
		} else {
			const requestBody = (await request.json()) as Record<string, any>;
			console.log('Request body:', requestBody);

			projectId = requestBody.projectId;
			projectTitle = requestBody.projectTitle;
			pincode = requestBody.pincode;
			projectDate = requestBody.projectDate;
			business_slug = requestBody.business_slug;
			removeImage = requestBody.removeImage;
		}

		if (!projectId) {
			console.log('Validation failed: Missing project ID');
			return json(
				{
					success: false,
					error: 'Project ID is required for update'
				},
				{ status: 400 }
			);
		}

		if (!projectTitle || !pincode || !projectDate || !business_slug) {
			console.log('Validation failed: Missing required fields');
			return json(
				{
					success: false,
					error: 'Project title, pincode, project date and business slug are required'
				},
				{ status: 400 }
			);
		}

		if (!/^\d+$/.test(pincode)) {
			console.log('Validation failed: Invalid pincode format');
			return json(
				{
					success: false,
					error: 'Pincode must contain only numbers'
				},
				{ status: 400 }
			);
		}

		console.log('All validations passed');

		if (sessionResult.session.businessSlug !== business_slug) {
			return json(
				{ success: false, error: 'Forbidden - You can only update your own projects' },
				{ status: 403 }
			);
		}

		try {
			const [existingProject] = await db
				.select()
				.from(projects)
				.where(
					and(eq(projects.id, Number(projectId)), eq(projects.businessSlug, business_slug))
				)
				.limit(1);

			if (!existingProject) {
				return json(
					{
						success: false,
						error: 'Project not found or you do not have permission to update it'
					},
					{ status: 404 }
				);
			}

			console.log('Existing project:', existingProject);

			let district = 'Unknown';
			try {
				const [districtRow] = await db
					.select({ district: pincodeMapping.district })
					.from(pincodeMapping)
					.where(eq(pincodeMapping.pincode, pincode))
					.limit(1);

				if (districtRow) {
					district = districtRow.district;
					console.log('Found district for pincode', pincode, ':', district);
				} else {
					console.log('No district found for pincode', pincode, ', using "Unknown"');
				}
			} catch (districtError) {
				console.error('Error looking up district for pincode', pincode, ':', districtError);
			}

			let projectSlug = existingProject.projectSlug;
			if (projectTitle !== existingProject.title) {
				projectSlug = generateProjectSlug(projectTitle);
				console.log('Generated new project slug:', projectSlug);
			}

			const updateValues: Partial<typeof projects.$inferInsert> = {
				title: projectTitle,
				projectSlug,
				pincode,
				district,
				projectDate
			};

			const oldPublicId = existingProject.cloudinaryPublicId;

			// The old dynamic RETURNING list included the image columns only when a
			// new image was uploaded, or when the row already had one and nothing
			// changed. Preserved here so the JSON response shape is unchanged.
			let includeImageFields = false;

			if (removeImage) {
				updateValues.imageUrl = null;
				updateValues.cloudinaryPublicId = null;
				updateValues.imageWidth = null;
				updateValues.imageHeight = null;
				updateValues.imageFormat = null;

				if (oldPublicId) {
					await deleteFromCloudinary(oldPublicId);
				}
			} else if (imageData) {
				updateValues.imageUrl = imageData.url;
				updateValues.cloudinaryPublicId = imageData.publicId;
				updateValues.imageWidth = imageData.width;
				updateValues.imageHeight = imageData.height;
				updateValues.imageFormat = imageData.format;
				includeImageFields = true;

				if (oldPublicId) {
					await deleteFromCloudinary(oldPublicId);
				}
			} else if (existingProject.imageUrl) {
				includeImageFields = true;
			}

			const [project] = await db
				.update(projects)
				.set(updateValues)
				.where(and(eq(projects.id, Number(projectId)), eq(projects.businessSlug, business_slug)))
				.returning({
					id: projects.id,
					business_slug: projects.businessSlug,
					title: projects.title,
					project_slug: projects.projectSlug,
					pincode: projects.pincode,
					district: projects.district,
					project_date: projects.projectDate,
					created_at: projects.createdAt,
					...(includeImageFields
						? {
								image_url: projects.imageUrl,
								cloudinary_public_id: projects.cloudinaryPublicId,
								image_width: projects.imageWidth,
								image_height: projects.imageHeight,
								image_format: projects.imageFormat
							}
						: {})
				});

			console.log('Project updated successfully:', project);

			return json({
				success: true,
				project
			});
		} catch (dbError) {
			console.error('❌ Database error:', dbError);
			return json(
				{
					success: false,
					error: 'Database error: ' + (dbError instanceof Error ? dbError.message : String(dbError))
				},
				{ status: 500 }
			);
		}
};

export const DELETE: RequestHandler = async ({ request, cookies }) => {
	console.log('Received project delete request');

	try {
		const { BusinessAuthService } = await import('$lib/in/auth/business');
		const authService = new BusinessAuthService();
		const sessionResult = authService.validateSession(cookies);

		if (!sessionResult.success) {
			return json({ success: false, error: 'Unauthorized - Please login' }, { status: 401 });
		}

		const requestBody = (await request.json()) as Record<string, any>;
		const { projectId, business_slug } = requestBody;

		if (!projectId || !business_slug) {
			return json(
				{
					success: false,
					error: 'Project ID and business slug are required'
				},
				{ status: 400 }
			);
		}

		if (sessionResult.session.businessSlug !== business_slug) {
			return json(
				{ success: false, error: 'Forbidden - You can only delete your own projects' },
				{ status: 403 }
			);
		}

		try {
			const existingProject = await db
				.select({ id: projects.id })
				.from(projects)
				.where(and(eq(projects.id, Number(projectId)), eq(projects.businessSlug, business_slug)));

			if (existingProject.length === 0) {
				return json(
					{
						success: false,
						error: 'Project not found or you do not have permission to delete it'
					},
					{ status: 404 }
				);
			}

			const hidden = await db
				.update(projects)
				.set({ isvisible: false })
				.where(and(eq(projects.id, Number(projectId)), eq(projects.businessSlug, business_slug)))
				.returning({ id: projects.id, title: projects.title });

			if (hidden.length === 0) {
				return json(
					{
						success: false,
						error: 'Failed to hide project'
					},
					{ status: 500 }
				);
			}

			console.log('Project hidden successfully:', projectId);

			return json({
				success: true,
				message: 'Project hidden successfully'
			});
		} catch (dbError) {
			console.error('❌ Database error:', dbError);
			return json(
				{
					success: false,
					error: 'Database error: ' + (dbError instanceof Error ? dbError.message : String(dbError))
				},
				{ status: 500 }
			);
		}
} catch (error) {
	console.error('Error in DELETE handler:', error);
	return json(
		{ success: false, error: 'An unexpected error occurred' },
		{ status: 500 }
	);
}
};
