// api/updateRecentProject/+server.js

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
async function uploadToCloudinary(file) {
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

		console.log('Image uploaded to Cloudinary:', result.secure_url);
		return {
			url: result.secure_url,
			publicId: result.public_id,
			width: result.width,
			height: result.height,
			format: result.format
		};
	} catch (error) {
		console.error('Cloudinary upload error:', error);
		throw error;
	}
}

// Helper function to delete from Cloudinary
async function deleteFromCloudinary(publicId) {
	try {
		if (!publicId) return;
		
		const result = await new Promise((resolve, reject) => {
			cloudinary.uploader.destroy(publicId, (error, result) => {
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

export async function PUT({ request }) {
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
			if (projectImage && projectImage.size > 0) {
				try {
					// Upload to Cloudinary
					imageData = await uploadToCloudinary(projectImage);
					console.log('Image uploaded successfully to Cloudinary');
				} catch (imageError) {
					console.error('Error uploading image to Cloudinary:', imageError);
					return json(
						{
							success: false,
							error: 'Failed to upload image: ' + imageError.message
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

		const client = await pool.connect();
		try {
			// First, get the existing project to check ownership and get old image data
			const existingProjectResult = await client.query(
				'SELECT * FROM projects WHERE id = $1 AND business_slug = $2',
				[projectId, business_slug]
			);

			if (existingProjectResult.rows.length === 0) {
				return json(
					{
						success: false,
						error: 'Project not found or you do not have permission to update it'
					},
					{ status: 404 }
				);
			}

			const existingProject = existingProjectResult.rows[0];
			console.log('Existing project:', existingProject);

			// Look up county using pincode
			let county = 'Unknown'; // Default value
			try {
				const countyResult = await client.query(
					'SELECT district FROM pincode_mapping WHERE pincode = $1',
					[pincode]
				);

				if (countyResult.rows.length > 0) {
					county = countyResult.rows[0].district;
					console.log('Found county for pincode', pincode, ':', county);
				} else {
					console.log('No county found for pincode', pincode, ', using "Unknown"');
				}
			} catch (countyError) {
				console.error('Error looking up county for pincode', pincode, ':', countyError);
				// Continue with 'Unknown' as default
			}

			// Generate new project slug if title changed
			let projectSlug = existingProject.project_slug;
			if (projectTitle !== existingProject.title) {
				projectSlug = generateProjectSlug(projectTitle);
				console.log('Generated new project slug:', projectSlug);
			}

			// Build the update query dynamically
			let updateFields = [
				'title = $2',
				'project_slug = $3',
				'pincode = $4',
				'county = $5',
				'project_date = $6'
			];
			let queryParams = [projectId, projectTitle, projectSlug, pincode, county, projectDate];
			let returnFields = 'id, business_slug, title, project_slug, pincode, county, project_date, created_at';
			let index = 7;

			// Handle image updates
			let oldPublicId = existingProject.cloudinary_public_id;

			if (removeImage) {
				// Remove image fields
				updateFields.push(
					`image_url = NULL`,
					`cloudinary_public_id = NULL`,
					`image_width = NULL`,
					`image_height = NULL`,
					`image_format = NULL`
				);
				
				// Delete old image from Cloudinary if it exists
				if (oldPublicId) {
					await deleteFromCloudinary(oldPublicId);
				}
			} else if (imageData) {
				// Update with new image
				updateFields.push(
					`image_url = $${index++}`,
					`cloudinary_public_id = $${index++}`,
					`image_width = $${index++}`,
					`image_height = $${index++}`,
					`image_format = $${index++}`
				);
				queryParams.push(
					imageData.url,
					imageData.publicId,
					imageData.width,
					imageData.height,
					imageData.format
				);
				returnFields += ', image_url, cloudinary_public_id, image_width, image_height, image_format';

				// Delete old image from Cloudinary if it exists
				if (oldPublicId) {
					await deleteFromCloudinary(oldPublicId);
				}
			} else {
				// Keep existing image data in return fields if it exists
				if (existingProject.image_url) {
					returnFields += ', image_url, cloudinary_public_id, image_width, image_height, image_format';
				}
			}

			const result = await client.query(
				`UPDATE projects 
				 SET ${updateFields.join(', ')}
				 WHERE id = $1 AND business_slug = '${business_slug}'
				 RETURNING ${returnFields}`,
				queryParams
			);

			console.log('Project updated successfully:', result.rows[0]);

			// Return the updated project
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

export async function DELETE({ request }) {
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

		const client = await pool.connect();
		try {
			// First, get the existing project to check ownership
			const existingProjectResult = await client.query(
				'SELECT * FROM projects WHERE id = $1 AND business_slug = $2',
				[projectId, business_slug]
			);

			if (existingProjectResult.rows.length === 0) {
				return json(
					{
						success: false,
						error: 'Project not found or you do not have permission to delete it'
					},
					{ status: 404 }
				);
			}

			// Set isvisible to FALSE instead of deleting the record
			const result = await client.query(
				'UPDATE projects SET isvisible = FALSE WHERE id = $1 AND business_slug = $2 RETURNING id, title',
				[projectId, business_slug]
			);

			if (result.rows.length === 0) {
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