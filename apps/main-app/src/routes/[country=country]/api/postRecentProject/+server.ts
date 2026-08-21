// api/postRecentProject/+server.js

import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { pincodeMapping, projects } from '@solar/db/schema';
import { eq } from 'drizzle-orm';
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

	// Replace decimal points with underscores (e.g., "7.4kW" → "7_4kw")
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

// Helper function to upload to Cloudinary from File object (Web)
async function uploadFileToCloudinary(file: File) {
	try {
		// Convert file to base64 for Cloudinary upload
		const buffer = Buffer.from(await file.arrayBuffer());
		const base64Data = buffer.toString('base64');

		// Format for Cloudinary upload
		const dataURI = `data:${file.type};base64,${base64Data}`;

		// Upload to Cloudinary
		const result: any = await new Promise((resolve, reject) => {
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
				(error, result: any) => {
					if (error) reject(error);
					else resolve(result);
				}
			);
		});

		console.log('File uploaded to Cloudinary:', result.secure_url);
		return {
			url: result.secure_url,
			publicId: result.public_id,
			width: result.width,
			height: result.height,
			format: result.format
		};
	} catch (error: any) {
		console.error('Cloudinary file upload error:', error);
		throw error;
	}
}

// Helper function to upload to Cloudinary from base64 string (Android)
async function uploadBase64ToCloudinary(base64Data: string, mimetype: string, filename: string) {
	try {
		// Clean filename for public_id
		const cleanFilename = filename.replace(/[^a-zA-Z0-9-_]/g, '');

		const dataURI = `data:${mimetype};base64,${base64Data}`;

		const result: any = await new Promise((resolve, reject) => {
			cloudinary.uploader.upload(
				dataURI,
				{
					folder: 'projects',
					resource_type: 'auto',
					public_id: `android-${Date.now()}-${cleanFilename}`,
					transformation: [{ width: 1200, crop: 'limit' }, { quality: 'auto' }]
				},
				(error, result: any) => {
					if (error) reject(error);
					else resolve(result);
				}
			);
		});

		console.log('Base64 image uploaded to Cloudinary:', result.secure_url);
		return {
			url: result.secure_url,
			publicId: result.public_id,
			width: result.width,
			height: result.height,
			format: result.format
		};
	} catch (error: any) {
		console.error('Cloudinary base64 upload error:', error);
		throw error;
	}
}

interface RequestBody {
	projectTitle: string;
	pincode: string;
	projectDate: string;
	business_slug: string;
	image?: {
		data: string;
		mimetype: string;
		filename?: string;
	};
}

export const POST: RequestHandler = async ({ request, params }) => {
	// No layout runs for a +server.ts, so both guards live here. The features
	// check mirrors how S10 gated the project *pages*: the `projects` table is
	// IN-only and has no country_code column, so a US caller must not write to
	// it. isCountry alone would let it through.
	if (!params.country || !isCountry(params.country)) {
		return json({ error: 'Unknown country' }, { status: 404 });
	}
	if (!getCountry(params.country).features.projects) {
		return json({ error: 'Not found' }, { status: 404 });
	}

	console.log('Received project submission request');

	try {
		const contentType = request.headers.get('content-type') || '';

		let projectTitle, pincode, projectDate, business_slug;
		let imageData = null;

		if (contentType.includes('multipart/form-data')) {
			// Handle form data (Website)
			console.log('Processing multipart form data (Website)');
			const formData = await request.formData();

			projectTitle = formData.get('projectTitle') as string;
			pincode = formData.get('pincode') as string;
			projectDate = formData.get('projectDate') as string;
			business_slug = formData.get('business_slug') as string;
			const projectImage = formData.get('projectImage');

			if (projectImage instanceof File && projectImage.size > 0) {
				try {
					imageData = await uploadFileToCloudinary(projectImage);
					console.log('Multipart image uploaded successfully');
				} catch (imageError: any) {
					// Previously this was logged and swallowed, so the project was
					// inserted without an image and the caller was told it succeeded.
					console.error('Error uploading multipart image:', imageError);
					return json(
						{ success: false, error: 'Image upload failed. Please try again.' },
						{ status: 502 }
					);
				}
			}
		} else if (contentType.includes('application/json')) {
			// Handle JSON data (Android App)
			console.log('Processing JSON data (Android App)');
			const requestBody: RequestBody = await request.json();

			projectTitle = requestBody.projectTitle;
			pincode = requestBody.pincode;
			projectDate = requestBody.projectDate;
			business_slug = requestBody.business_slug;

			// Handle base64 image from Android
			if (requestBody.image && requestBody.image.data) {
				try {
					imageData = await uploadBase64ToCloudinary(
						requestBody.image.data,
						requestBody.image.mimetype,
						requestBody.image.filename || 'android-upload'
					);
					console.log('Base64 image uploaded successfully');
				} catch (imageError: any) {
					console.error('Error uploading base64 image:', imageError);
					return json(
						{ success: false, error: 'Image upload failed. Please try again.' },
						{ status: 502 }
					);
				}
			}
		} else {
			return json({ success: false, error: 'Unsupported content type' }, { status: 400 });
		}

		// Validate required fields
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

		if (!imageData) {
			console.log('Validation failed: Missing project image');
			return json({ success: false, error: 'Project image is required' }, { status: 400 });
		}

		// Validate pincode format (numbers only)
		if (pincode && !/^\d+$/.test(pincode)) {
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

		// Generate project slug
		const projectSlug = projectTitle ? generateProjectSlug(projectTitle) : '';
		console.log('Generated project slug:', projectSlug);

		try {
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
			} catch (districtError: any) {
				console.error('Error looking up district for pincode', pincode, ':', districtError);
				// Continue with 'Unknown' as default
			}

			// Now we directly use the business_slug instead of looking up the business_id
			console.log('Using business slug:', business_slug);

			// The image columns are unconditional now that a project cannot be
			// created without one.
			const inserted = await db
				.insert(projects)
				.values({
					businessSlug: business_slug,
					title: projectTitle,
					projectSlug,
					pincode,
					district,
					projectDate,
					imageUrl: imageData.url,
					cloudinaryPublicId: imageData.publicId,
					imageWidth: imageData.width,
					imageHeight: imageData.height,
					imageFormat: imageData.format
				})
				.returning({
					id: projects.id,
					business_slug: projects.businessSlug,
					title: projects.title,
					project_slug: projects.projectSlug,
					pincode: projects.pincode,
					district: projects.district,
					project_date: projects.projectDate,
					created_at: projects.createdAt,
					image_url: projects.imageUrl,
					cloudinary_public_id: projects.cloudinaryPublicId,
					image_width: projects.imageWidth,
					image_height: projects.imageHeight,
					image_format: projects.imageFormat
				});

			console.log('Project inserted successfully:', inserted[0]);

			// Return the newly created project
			return json({
				success: true,
				project: inserted[0]
			});
		} catch (dbError: any) {
			console.error('Database error:', dbError);
			return json(
				{
					success: false,
					error: 'Database error: ' + dbError.message
				},
				{ status: 500 }
			);
		}
	} catch (error: any) {
		console.error('Error processing request:', error);
		return json(
			{
				success: false,
				error: 'Internal server error: ' + error.message
			},
			{ status: 500 }
		);
	}
};
