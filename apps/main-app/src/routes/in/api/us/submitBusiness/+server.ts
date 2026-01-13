import { createPool, type VercelPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { json, type RequestHandler } from '@sveltejs/kit';

interface BusinessData {
	businessName: string;
	address: string;
	plusCode?: string;
	phoneNumber: string;
	whatsappNumber?: string;
	email?: string;
	login_email?: string;
	website?: string;
	gstn?: string;
	state: string;
	county: string;
	city: string;
}

interface BusinessResult {
	id: number;
}

export const POST: RequestHandler = async ({ request, fetch }) => {
	const pool: VercelPool = createPool({ connectionString: POSTGRES_URL });

	try {
		const data = await request.json() as BusinessData;
		const {
			businessName,
			address,
			plusCode,
			phoneNumber,
			whatsappNumber,
			email,
			login_email,
			website,
			gstn,
			state,
			county,
			city
		} = data;

		const rscore = 0;
		const isvisible = 0;
		const businessfilled = false;
		const tag = 'blank';
		const slug = null;
		const notes = null;
		const login_password = 'businessadminzpassword';

		const insertQuery = `
            INSERT INTO us_businesses (
                rscore, isvisible, businessfilled, pluscode, phonenumber, whatsapp, email, login_email, website, ein, state, county, city, tag, slug, notes, businessname, address, login_password)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
            RETURNING id
        `;

		const result = await pool.query<BusinessResult>(insertQuery, [
			rscore,
			isvisible,
			businessfilled,
			plusCode || null,
			phoneNumber,
			whatsappNumber || null,
			email || null,
			login_email || 'admin@example.com',
			website || null,
			gstn || null,
			state,
			county,
			city,
			tag,
			slug,
			notes,
			businessName,
			address,
			login_password
		]);

		const businessId = result.rows[0].id;

		await fetch('/api/us/sendBusinessSubmissionConfirmation', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				id: businessId,
				businessName,
				address,
				plusCode,
				phoneNumber,
				whatsappNumber,
				email,
				login_email,
				website,
				gstn,
				state,
				county,
				city
			})
		});

		return json({ success: true, id: businessId });
	} catch (error) {
		console.error('Error inserting US business data:', error);
		return json({ success: false, error: 'Failed to submit business' }, { status: 500 });
	}
};
