import { json } from '@sveltejs/kit';
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';

export async function POST({ request }) {
	try {
		const data = await request.json();

		// Validate required fields
		if (!data.id) {
			return json({ error: 'Blog ID is required' }, { status: 400 });
		}

		const pool = createPool({ connectionString: POSTGRES_URL });

		// Check if blog exists
		const blogCheck = await pool.query(
			'SELECT id, title FROM in_blogs WHERE id = $1',
			[data.id]
		);

		if (blogCheck.rows.length === 0) {
			return json({ error: 'Blog not found' }, { status: 404 });
		}

		const blogTitle = blogCheck.rows[0].title;

		// Hard delete (permanent removal)
		// Alternative: Soft delete by setting status = 'deleted'
		await pool.query('DELETE FROM in_blogs WHERE id = $1', [data.id]);

		return json({
			success: true,
			message: `Blog "${blogTitle}" deleted successfully`
		});
	} catch (error) {
		console.error('Error deleting blog:', error);
		return json(
			{ error: 'Failed to delete blog. Please try again.' },
			{ status: 500 }
		);
	}
}

// Alternative: Soft delete endpoint
export async function PATCH({ request }) {
	try {
		const data = await request.json();

		if (!data.id) {
			return json({ error: 'Blog ID is required' }, { status: 400 });
		}

		const pool = createPool({ connectionString: POSTGRES_URL });

		// Soft delete - set status to 'archived'
		const result = await pool.query(
			`UPDATE in_blogs SET status = 'archived' WHERE id = $1 RETURNING id, title`,
			[data.id]
		);

		if (result.rows.length === 0) {
			return json({ error: 'Blog not found' }, { status: 404 });
		}

		return json({
			success: true,
			message: `Blog "${result.rows[0].title}" archived successfully`
		});
	} catch (error) {
		console.error('Error archiving blog:', error);
		return json(
			{ error: 'Failed to archive blog. Please try again.' },
			{ status: 500 }
		);
	}
}
