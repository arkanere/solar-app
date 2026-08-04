import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { pincodeMapping, usProjects } from '@solar/db/schema';
import { eq } from 'drizzle-orm';
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
 * Upload file to Cloudinary from File object (Web)
 */
async function uploadFileToCloudinary(file: File): Promise<CloudinaryUploadResult> {
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

		console.log('File uploaded to Cloudinary:', result.secure_url);
		return {
			url: result.secure_url,
			publicId: result.public_id,
			width: result.width,
			height: result.height,
			format: result.format
		};
	} catch (error) {
		console.error('❌ Cloudinary file upload error:', error);
		throw error;
	}
}

/**
 * Upload base64 image to Cloudinary (Android)
 */
async function uploadBase64ToCloudinary(
	base64Data: string,
	mimetype: string,
	filename: string
): Promise<CloudinaryUploadResult> {
	try {
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
				(error, result) => {
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
	} catch (error) {
		console.error('❌ Cloudinary base64 upload error:', error);
		throw error;
	}
}

export const POST: RequestHandler = async ({ request, cookies }) => {
	console.log('Received project submission request');

	try {
		const { BusinessAuthService } = await import('$lib/us/auth/business');
		const authService = new BusinessAuthService();
		const sessionResult = authService.validateSession(cookies);

		if (!sessionResult.success) {
			return json({ success: false, error: 'Unauthorized - Please login' }, { status: 401 });
		}

		const contentType = request.headers.get('content-type') || '';

		let projectTitle: string | null = null;
		let pincode: string | null = null;
		let projectDate: string | null = null;
		let business_slug: string | null = null;
		let imageData: CloudinaryUploadResult | null = null;

		if (contentType.includes('multipart/form-data')) {
			console.log('Processing multipart form data (Website)');
			const formData = await request.formData();

			projectTitle = formData.get('projectTitle') as string | null;
			pincode = formData.get('pincode') as string | null;
			projectDate = formData.get('projectDate') as string | null;
			business_slug = formData.get('business_slug') as string | null;
			const projectImage = formData.get('projectImage') as File | null;

			if (projectImage && projectImage.size > 0) {
				try {
					imageData = await uploadFileToCloudinary(projectImage);
					console.log('Multipart image uploaded successfully');
				} catch (imageError) {
					console.error('Error uploading multipart image:', imageError);
				}
			}
		} else if (contentType.includes('application/json')) {
			console.log('Processing JSON data (Android App)');
			const requestBody = (await request.json()) as Record<string, any>;

			projectTitle = requestBody.projectTitle;
			pincode = requestBody.pincode;
			projectDate = requestBody.projectDate;
			business_slug = requestBody.business_slug;

			if (requestBody.image && requestBody.image.data) {
				try {
					imageData = await uploadBase64ToCloudinary(
						requestBody.image.data,
						requestBody.image.mimetype,
						requestBody.image.filename || 'android-upload'
					);
					console.log('Base64 image uploaded successfully');
				} catch (imageError) {
					console.error('Error uploading base64 image:', imageError);
				}
			}
		} else {
			return json({ success: false, error: 'Unsupported content type' }, { status: 400 });
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
				{ success: false, error: 'Forbidden - You can only create projects for your own business' },
				{ status: 403 }
			);
		}

		const projectSlug = generateProjectSlug(projectTitle);
		console.log('Generated project slug:', projectSlug);

		try {
			let county = 'Unknown';
			try {
				const [countyRow] = await db
					.select({ district: pincodeMapping.district })
					.from(pincodeMapping)
					.where(eq(pincodeMapping.pincode, pincode))
					.limit(1);

				if (countyRow) {
					county = countyRow.district;
					console.log('Found county for pincode', pincode, ':', county);
				} else {
					console.log('No county found for pincode', pincode, ', using "Unknown"');
				}
			} catch (countyError) {
				console.error('Error looking up county for pincode', pincode, ':', countyError);
			}

			console.log('Using business slug:', business_slug);

			// Writes go to us_projects (the raw SQL targeted `projects`, the IN table,
			// with a `county` column that table doesn't have — the statement could
			// never have succeeded). `zipcode` is us_projects' name for this value;
			// it is still returned as `pincode` so the response shape is unchanged.
			const [project] = await db
				.insert(usProjects)
				.values({
					businessSlug: business_slug,
					title: projectTitle,
					projectSlug,
					zipcode: pincode,
					county,
					projectDate,
					...(imageData
						? {
								imageUrl: imageData.url,
								cloudinaryPublicId: imageData.publicId,
								imageWidth: imageData.width,
								imageHeight: imageData.height,
								imageFormat: imageData.format
							}
						: {})
				})
				.returning({
					id: usProjects.id,
					business_slug: usProjects.businessSlug,
					title: usProjects.title,
					project_slug: usProjects.projectSlug,
					pincode: usProjects.zipcode,
					county: usProjects.county,
					project_date: usProjects.projectDate,
					created_at: usProjects.createdAt,
					...(imageData
						? {
								image_url: usProjects.imageUrl,
								cloudinary_public_id: usProjects.cloudinaryPublicId,
								image_width: usProjects.imageWidth,
								image_height: usProjects.imageHeight,
								image_format: usProjects.imageFormat
							}
						: {})
				});

			console.log('Project inserted successfully:', project);

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
	} catch (error) {
		console.error('❌ Error processing request:', error);
		return json(
			{
				success: false,
				error: 'Internal server error: ' + (error instanceof Error ? error.message : String(error))
			},
			{ status: 500 }
		);
	}
};
