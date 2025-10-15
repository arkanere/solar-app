// api/postRecentProject/+server.js

import { json } from '@sveltejs/kit';
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
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

const pool = createPool({ connectionString: POSTGRES_URL });

// Helper function to generate project slug
function generateProjectSlug(title) {
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
async function uploadFileToCloudinary(file) {
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

		console.log('File uploaded to Cloudinary:', result.secure_url);
		return {
			url: result.secure_url,
			publicId: result.public_id,
			width: result.width,
			height: result.height,
			format: result.format
		};
	} catch (error) {
		console.error('Cloudinary file upload error:', error);
		throw error;
	}
}

// Helper function to upload to Cloudinary from base64 string (Android)
async function uploadBase64ToCloudinary(base64Data, mimetype, filename) {
	try {
		// Clean filename for public_id
		const cleanFilename = filename.replace(/[^a-zA-Z0-9-_]/g, '');
		
		const dataURI = `data:${mimetype};base64,${base64Data}`;

		const result = await new Promise((resolve, reject) => {
			cloudinary.uploader.upload(
				dataURI,
				{
					folder: 'projects',
					resource_type: 'auto',
					public_id: `android-${Date.now()}-${cleanFilename}`,
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

		console.log('Base64 image uploaded to Cloudinary:', result.secure_url);
		return {
			url: result.secure_url,
			publicId: result.public_id,
			width: result.width,
			height: result.height,
			format: result.format
		};
	} catch (error) {
		console.error('Cloudinary base64 upload error:', error);
		throw error;
	}
}

export async function POST({ request }) {
	console.log('Received project submission request');

	try {
		const contentType = request.headers.get('content-type') || '';
		
		let projectTitle, pincode, projectDate, business_slug;
		let imageData = null;

		if (contentType.includes('multipart/form-data')) {
			// Handle form data (Website)
			console.log('Processing multipart form data (Website)');
			const formData = await request.formData();
			
			projectTitle = formData.get('projectTitle');
			pincode = formData.get('pincode');
			projectDate = formData.get('projectDate');
			business_slug = formData.get('business_slug');
			const projectImage = formData.get('projectImage');

			if (projectImage && projectImage.size > 0) {
				try {
					imageData = await uploadFileToCloudinary(projectImage);
					console.log('Multipart image uploaded successfully');
				} catch (imageError) {
					console.error('Error uploading multipart image:', imageError);
				}
			}

		} else if (contentType.includes('application/json')) {
			// Handle JSON data (Android App)
			console.log('Processing JSON data (Android App)');
			const requestBody = await request.json();

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
				} catch (imageError) {
					console.error('Error uploading base64 image:', imageError);
				}
			}
		} else {
			return json(
				{ success: false, error: 'Unsupported content type' },
				{ status: 400 }
			);
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

		// Generate project slug
		const projectSlug = generateProjectSlug(projectTitle);
		console.log('Generated project slug:', projectSlug);

		const client = await pool.connect();
		try {
			// Look up district using pincode
			let district = 'Unknown'; // Default value
			try {
				const districtResult = await client.query(
					'SELECT district FROM pincode_mapping WHERE pincode = $1',
					[pincode]
				);

				if (districtResult.rows.length > 0) {
					district = districtResult.rows[0].district;
					console.log('Found district for pincode', pincode, ':', district);
				} else {
					console.log('No district found for pincode', pincode, ', using "Unknown"');
				}
			} catch (districtError) {
				console.error('Error looking up district for pincode', pincode, ':', districtError);
				// Continue with 'Unknown' as default
			}

			// Now we directly use the business_slug instead of looking up the business_id
			console.log('Using business slug:', business_slug);

			// Build the query dynamically based on available data
			let queryFields =
				'business_slug, title, project_slug, pincode, district, project_date';
			let queryValues = '$1, $2, $3, $4, $5, $6';
			let queryParams = [business_slug, projectTitle, projectSlug, pincode, district, projectDate];
			let returnFields =
				'id, business_slug, title, project_slug, pincode, district, project_date, created_at';
			let index = 7;

			// Add image data if available
			if (imageData) {
				// Add URL
				queryFields += ', image_url';
				queryValues += `, $${index++}`;
				queryParams.push(imageData.url);
				returnFields += ', image_url';

				// Add public ID
				queryFields += ', cloudinary_public_id';
				queryValues += `, $${index++}`;
				queryParams.push(imageData.publicId);
				returnFields += ', cloudinary_public_id';

				// Add image dimensions
				queryFields += ', image_width, image_height';
				queryValues += `, $${index++}, $${index++}`;
				queryParams.push(imageData.width, imageData.height);
				returnFields += ', image_width, image_height';

				// Add image format
				queryFields += ', image_format';
				queryValues += `, $${index++}`;
				queryParams.push(imageData.format);
				returnFields += ', image_format';
			}

			const result = await client.query(
				`INSERT INTO projects (${queryFields}) 
         VALUES (${queryValues}) 
         RETURNING ${returnFields}`,
				queryParams
			);

			console.log('Project inserted successfully:', result.rows[0]);

			// Return the newly created project
			return json({
				success: true,
				project: result.rows[0]
			});
		} catch (dbError) {
			console.error('Database error:', dbError);
			return json(
				{
					success: false,
					error: 'Database error: ' + dbError.message
				},
				{ status: 500 }
			);
		} finally {
			client.release();
		}
	} catch (error) {
		console.error('Error processing request:', error);
		return json(
			{
				success: false,
				error: 'Internal server error: ' + error.message
			},
			{ status: 500 }
		);
	}
}
