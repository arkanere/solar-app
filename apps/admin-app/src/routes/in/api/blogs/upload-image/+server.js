import { json } from '@sveltejs/kit';
import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } from '$env/static/private';
import { PUBLIC_CLOUDINARY_CLOUD_NAME } from '$env/static/public';

// Configure Cloudinary
cloudinary.config({
	cloud_name: PUBLIC_CLOUDINARY_CLOUD_NAME,
	api_key: CLOUDINARY_API_KEY,
	api_secret: CLOUDINARY_API_SECRET
});

export async function POST({ request }) {
	try {
		const formData = await request.formData();
		const image = formData.get('image');

		if (!image || !(image instanceof File)) {
			return json({ error: 'No image file provided' }, { status: 400 });
		}

		// Convert file to buffer
		const arrayBuffer = await image.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		// Upload to Cloudinary
		const result = await new Promise((resolve, reject) => {
			const uploadStream = cloudinary.uploader.upload_stream(
				{
					folder: 'solar-vipani-blogs', // Organize in folder
					resource_type: 'image',
					transformation: [
						{ width: 1200, height: 630, crop: 'limit' }, // Max dimensions for social sharing
						{ quality: 'auto' }, // Auto quality optimization
						{ fetch_format: 'auto' } // Auto format (WebP for supported browsers)
					]
				},
				(error, result) => {
					if (error) reject(error);
					else resolve(result);
				}
			);

			uploadStream.end(buffer);
		});

		return json({
			url: result.secure_url,
			cloudinaryId: result.public_id,
			width: result.width,
			height: result.height,
			format: result.format
		});
	} catch (error) {
		console.error('Error uploading image to Cloudinary:', error);
		return json({ error: 'Failed to upload image' }, { status: 500 });
	}
}
