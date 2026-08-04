// api/updateRecentProject/+server.js

import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { pincodeMapping, projects } from '@solar/db/schema';
import { and, eq } from 'drizzle-orm';
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } from '$env/static/private';
import { PUBLIC_CLOUDINARY_CLOUD_NAME } from '$env/static/public';
import { v2 as cloudinary } from 'cloudinary';
import { getCountry, isCountry } from '$lib/countries';

// Configure Cloudinary with credentials
cloudinary.config({
	cloud_name: PUBLIC_CLOUDINARY_CLOUD_NAME,
	api_key: CLOUDINARY_API_KEY,
	api_secret: CLOUDINARY_API_SECRET,
	secure: true
});

// Helper function to generate project slug
function generateProjectSlug(title: string) {
	// Convert to lowercase
	let slug = title.toLowerCase();

	// Replace decimal points with underscores (e.g., "7.4kW" � "7_4kw")
	slug = slug.replace(/\./g, '_');

	// Replace spaces and other non-alphanumeric characters (except underscores) with hyphens
	slug = slug.replace(/[^a-z0-9_]/g, '-');

	// Remove consecutive hyphens
	slug = slug.replace(/-+/g, '-');

	// Remove hyphens from start and end
	slug = slug.replace(/^-+|-+$/g, '');

	// Generate 6-character alphanumeric random string
	const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
	let randomString = '';
	for (let i = 0; i < 6; i++) {
		randomString += characters.charAt(Math.floor(Math.random() * characters.length));
	}

	// Append random string
	slug = slug + '-' + randomString;

	return slug;
}

// Helper function to upload to Cloudinary
async function uploadToCloudinary(file: File) {
	try {
		// Convert file to base64 for Cloudinary upload
		const buffer = Buffer.from(await file.arrayBuffer());
		const base64Data = buffer.toString('base64');

		// Format for Cloudinary upload
		const dataURI = `data:${file.type};base64,${base64Data}`;

		// Upload to Cloudinary
		const result = await new Promise((resolve, reject) => {
			cloudinary.uploader.upload(
				dataURI,
				{
					folder: 'projects', // Organize uploads in a folder
					resource_type: 'auto', // Auto-detect resource type
					transformation: [
						{ width: 1200, crop: 'limit' }, // Resize large images to max width 1200px
						{ quality: 'auto' } // Auto-optimize quality
					]
				},
				(error, result) => {
					if (error) reject(error);
					else resolve(result);
				}
			);
		});

		console.log('Image uploaded to Cloudinary:', (result as any).secure_url);
		return {
			url: (result as any).secure_url,
			publicId: (result as any).public_id,
			width: (result as any).width,
			height: (result as any).height,
			format: (result as any).format
		};
	} catch (error) {
		console.error('Cloudinary upload error:', error);
		throw error;
	}
}

// Helper function to delete from Cloudinary
async function deleteFromCloudinary(publicId: string) {
	try {
		if (!publicId) return;

		const result = await new Promise((resolve, reject) => {
			cloudinary.uploader.destroy(publicId, (error: any, result: any) => {
				if (error) reject(error);
				else resolve(result);
			});
		});

		console.log('Image deleted from Cloudinary:', publicId, result);
		return result;
	} catch (error) {
		console.error('Cloudinary delete error:', error);
		// Don't throw error as this shouldn't prevent the update
	}
}

export const PUT: RequestHandler = async ({ request, params }) => {
	// No layout runs for a +server.ts, so both guards live here. The features
	// check mirrors how S10 gated the project *pages*: the `projects` table is
	// IN-only and has no country_code column, so a US caller must not touch it.
	if (!params.country || !isCountry(params.country)) {
		return json({ error: 'Unknown country' }, { status: 404 });
	}
	if (!getCountry(params.country).features.projects) {
		return json({ error: 'Not found' }, { status: 404 });
	}

	console.log('Received project update request');

	try {
		// Check if the request is multipart form data
		const contentType = request.headers.get('content-type') || '';

		let projectId, projectTitle, pincode, projectDate, business_slug, projectImage, removeImage;
		let imageData = null;

		if (contentType.includes('multipart/form-data')) {
			// Handle form data
			const formData = await request.formData();
			projectId = formData.get('projectId');
			projectTitle = formData.get('projectTitle');
			pincode = formData.get('pincode');
			projectDate = formData.get('projectDate');
			business_slug = formData.get('business_slug');
			projectImage = formData.get('projectImage');
			removeImage = formData.get('removeImage') === 'true';

			// Handle image upload if it exists
			if (projectImage instanceof File && projectImage.size > 0) {
				try {
					// Upload to Cloudinary
					imageData = await uploadToCloudinary(projectImage);
					console.log('Image uploaded successfully to Cloudinary');
				} catch (imageError) {
					console.error('Error uploading image to Cloudinary:', imageError);
					return json(
						{
							success: false,
							error: 'Failed to upload image: ' + (imageError as Error).message
						},
						{ status: 500 }
					);
				}
			}
		} else {
			// Fallback to JSON parsing for backward compatibility
			const requestBody = await request.json();
			console.log('Request body:', requestBody);

			projectId = requestBody.projectId;
			projectTitle = requestBody.projectTitle;
			pincode = requestBody.pincode;
			projectDate = requestBody.projectDate;
			business_slug = requestBody.business_slug;
			removeImage = requestBody.removeImage;
		}

		// Validate required fields
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

		// Validate pincode format (numbers only)
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

		try {
			// First, get the existing project to check ownership and get old image data
			//
			// SECURITY: the old UPDATE interpolated business_slug straight into the
			// SQL string (`business_slug = '${business_slug}'`) while every other
			// value was parameterised — an injection hole on a caller-supplied
			// field. The query builder parameterises it.
			const owns = and(
				eq(projects.id, Number(projectId)),
				eq(projects.businessSlug, business_slug)
			);

			const existingRows = await db.select().from(projects).where(owns);

			if (existingRows.length === 0) {
				return json(
					{
						success: false,
						error: 'Project not found or you do not have permission to update it'
					},
					{ status: 404 }
				);
			}

			const existingProject = existingRows[0];
			console.log('Existing project:', existingProject);

			// Look up district using pincode
			let district = 'Unknown'; // Default value
			try {
				const districtRows = await db
					.select({ district: pincodeMapping.district })
					.from(pincodeMapping)
					.where(eq(pincodeMapping.pincode, pincode));

				if (districtRows.length > 0) {
					district = districtRows[0].district;
					console.log('Found district for pincode', pincode, ':', district);
				} else {
					console.log('No district found for pincode', pincode, ', using "Unknown"');
				}
			} catch (districtError) {
				console.error('Error looking up district for pincode', pincode, ':', districtError);
				// Continue with 'Unknown' as default
			}

			// Generate new project slug if title changed
			let projectSlug = existingProject.projectSlug;
			if (projectTitle !== existingProject.title) {
				projectSlug = generateProjectSlug(projectTitle);
				console.log('Generated new project slug:', projectSlug);
			}

			// Handle image updates. The dynamically built SET and RETURNING lists
			// became conditional spreads (the Phase 5 pattern); the RETURNING shape
			// is preserved exactly, including the branch that echoes the existing
			// image columns back when neither removing nor replacing.
			const oldPublicId = existingProject.cloudinaryPublicId;
			const clearImage = Boolean(removeImage);
			const returnsImage = clearImage
				? false
				: Boolean(imageData) || Boolean(existingProject.imageUrl);

			if ((clearImage || imageData) && oldPublicId) {
				// Delete old image from Cloudinary if it exists
				await deleteFromCloudinary(oldPublicId);
			}

			const updated = await db
				.update(projects)
				.set({
					title: projectTitle,
					projectSlug,
					pincode,
					district,
					projectDate,
					...(clearImage
						? {
								imageUrl: null,
								cloudinaryPublicId: null,
								imageWidth: null,
								imageHeight: null,
								imageFormat: null
							}
						: {}),
					...(!clearImage && imageData
						? {
								imageUrl: imageData.url,
								cloudinaryPublicId: imageData.publicId,
								imageWidth: imageData.width,
								imageHeight: imageData.height,
								imageFormat: imageData.format
							}
						: {})
				})
				.where(owns)
				.returning({
					id: projects.id,
					business_slug: projects.businessSlug,
					title: projects.title,
					project_slug: projects.projectSlug,
					pincode: projects.pincode,
					district: projects.district,
					project_date: projects.projectDate,
					created_at: projects.createdAt,
					...(returnsImage
						? {
								image_url: projects.imageUrl,
								cloudinary_public_id: projects.cloudinaryPublicId,
								image_width: projects.imageWidth,
								image_height: projects.imageHeight,
								image_format: projects.imageFormat
							}
						: {})
				});

			console.log('Project updated successfully:', updated[0]);

			// Return the updated project
			return json({
				success: true,
				project: updated[0]
			});
		} catch (dbError) {
			console.error('Database error:', dbError);
			return json(
				{
					success: false,
					error: 'Database error: ' + (dbError as Error).message
				},
				{ status: 500 }
			);
		}
	} catch (error) {
		console.error('Error processing request:', error);
		return json(
			{
				success: false,
				error: 'Internal server error: ' + (error as Error).message
			},
			{ status: 500 }
		);
	}
};

export const DELETE: RequestHandler = async ({ request, params }) => {
	// No layout runs for a +server.ts, so both guards live here. The features
	// check mirrors how S10 gated the project *pages*: the `projects` table is
	// IN-only and has no country_code column, so a US caller must not touch it.
	if (!params.country || !isCountry(params.country)) {
		return json({ error: 'Unknown country' }, { status: 404 });
	}
	if (!getCountry(params.country).features.projects) {
		return json({ error: 'Not found' }, { status: 404 });
	}

	console.log('Received project delete request');

	try {
		const requestBody = await request.json();
		const { projectId, business_slug } = requestBody;

		// Validate required fields
		if (!projectId || !business_slug) {
			return json(
				{
					success: false,
					error: 'Project ID and business slug are required'
				},
				{ status: 400 }
			);
		}

		try {
			const owns = and(
				eq(projects.id, Number(projectId)),
				eq(projects.businessSlug, business_slug)
			);

			// First, get the existing project to check ownership
			const existingRows = await db.select({ id: projects.id }).from(projects).where(owns);

			if (existingRows.length === 0) {
				return json(
					{
						success: false,
						error: 'Project not found or you do not have permission to delete it'
					},
					{ status: 404 }
				);
			}

			// Set isvisible to FALSE instead of deleting the record
			const hidden = await db
				.update(projects)
				.set({ isvisible: false })
				.where(owns)
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
			console.error('Database error:', dbError);
			return json(
				{
					success: false,
					error: 'Database error: ' + (dbError as Error).message
				},
				{ status: 500 }
			);
		}
	} catch (error) {
		console.error('Error processing request:', error);
		return json(
			{
				success: false,
				error: 'Internal server error: ' + (error as Error).message
			},
			{ status: 500 }
		);
	}
};
