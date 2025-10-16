import { json } from '@sveltejs/kit';
import { POSTGRES_URL } from '$env/static/private';
import { createPool } from '@vercel/postgres';

const pool = createPool({ connectionString: POSTGRES_URL });

export async function GET({ params }) {
	try {
		const { business_slug } = params;

		if (!business_slug) {
			return json({ 
				success: false, 
				message: 'Business slug is required' 
			}, { status: 400 });
		}

		const client = await pool.connect();
		
		try {
			// First, get the main business using the slug
			const mainBusinessResult = await client.query(
				'SELECT * FROM businesses_1 WHERE slug = $1 AND isvisible = TRUE LIMIT 1',
				[business_slug]
			);

			if (mainBusinessResult.rows.length === 0) {
				return json({ 
					success: false, 
					message: 'Business not found' 
				}, { status: 404 });
			}

			const mainBusiness = mainBusinessResult.rows[0];
			const mainBusinessId = mainBusiness.id;

			// Get all branch offices linked to this main business
			const branchesResult = await client.query(`
				SELECT b.* 
				FROM branches br
				JOIN businesses_1 b ON br.branch_id = b.id
				WHERE br.main_id = $1 AND br.isactive = TRUE AND b.isvisible = TRUE
			`, [mainBusinessId]);

			const branches = branchesResult.rows;

			// Format the response data
			const formatBranch = (business, isMain = false) => ({
				id: business.id,
				businessname: business.businessname,
				slug: business.slug,
				address: business.address,
				city: business.city,
				district: business.district,
				state: business.state,
				phonenumber: business.phonenumber,
				email: business.email,
				isMainBranch: isMain
			});

			return json({
				success: true,
				mainBusiness: formatBranch(mainBusiness, true),
				branches: branches.map(branch => formatBranch(branch, false))
			});

		} catch (error) {
			console.error('Database query error:', error);
			return json({ 
				success: false, 
				message: 'Internal server error' 
			}, { status: 500 });
		} finally {
			client.release();
		}

	} catch (error) {
		console.error('Get branches API error:', error);
		return json({ 
			success: false, 
			message: 'Invalid request' 
		}, { status: 400 });
	}
}