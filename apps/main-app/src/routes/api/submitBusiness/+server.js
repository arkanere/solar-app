// import { createPool } from '@vercel/postgres';
// import { POSTGRES_URL } from '$env/static/private';
// import { json } from '@sveltejs/kit';

// export async function POST({ request }) {
//     const pool = createPool({ connectionString: POSTGRES_URL });

//     try {
//         const data = await request.json();
//         const {
//             businessName,
//             address,
//             plusCode,
//             phoneNumber,
//             email,
//             login_email,
//             website,
//             gstn,
//             state,
//             district,
//             city
//         } = data;

//         // Set default values for non-form fields
//         const rscore = 0;  // Default value for rscore
//         const isvisible = 0;  // Assuming 1 means visible
//         const tag = 'blank';  // Default tag
//         const slug = null;  // Empty slug for now
//         const notes = null;  // Empty notes for now
//         const login_password =  'businessadminzpassword';

//         // If any optional fields are missing, insert NULL for those values
//         const insertQuery = `
//             INSERT INTO businesses_1 (
//                 rscore, isvisible, pluscode, phonenumber, email, login_email,  website, gstn, state, district, tag, slug, notes, city, businessname, address,
//             login_password)
//             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
//             RETURNING id
//         `;

//         // Use NULL for optional fields if they are not provided or empty
//         const result = await pool.query(insertQuery, [
//             rscore,
//             isvisible,
//             plusCode || null,  // If plusCode is not provided, insert NULL
//             phoneNumber,
//             email || null,  // If email is not provided, insert NULL
//             login_email || 'admin@example.com',
//             website || null,  // If website is not provided, insert NULL
//             gstn || null,  // If GSTN is not provided, insert NULL
//             state,
//             district,
//             tag,
//             slug,
//             notes,
//             city,
//             businessName,
//             address,
//             login_password
//         ]);

//         return json({ success: true, id: result.rows[0].id });

//     } catch (error) {
//         console.error('Error inserting business data:', error);
//         return json({ success: false, error: 'Failed to submit business' }, { status: 500 });
//     }
// }

// src/routes/api/submitBusiness/+server.js
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { json } from '@sveltejs/kit';

export async function POST({ request, fetch }) {
	// ✅ Added fetch from event
	const pool = createPool({ connectionString: POSTGRES_URL });

	try {
		const data = await request.json();
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
			district,
			city
		} = data;

		// Server-side validation for required fields
		if (!businessName || businessName.trim() === '') {
			return json({ success: false, error: 'Business name is required' }, { status: 400 });
		}
		if (!address || address.trim() === '') {
			return json({ success: false, error: 'Address is required' }, { status: 400 });
		}
		if (!phoneNumber || phoneNumber.trim() === '') {
			return json({ success: false, error: 'Phone number is required' }, { status: 400 });
		}
		if (!email || email.trim() === '') {
			return json({ success: false, error: 'Business email is required' }, { status: 400 });
		}
		if (!login_email || login_email.trim() === '') {
			return json({ success: false, error: 'Login email is required' }, { status: 400 });
		}
		if (!gstn || gstn.trim() === '') {
			return json({ success: false, error: 'GSTN is required' }, { status: 400 });
		}
		if (!state || state.trim() === '') {
			return json({ success: false, error: 'State is required' }, { status: 400 });
		}
		if (!district || district.trim() === '') {
			return json({ success: false, error: 'District is required' }, { status: 400 });
		}
		if (!city || city.trim() === '') {
			return json({ success: false, error: 'City is required' }, { status: 400 });
		}

		// Check for duplicate GSTN
		const duplicateCheck = await pool.query(
			'SELECT id FROM businesses_1 WHERE gstn = $1',
			[gstn]
		);
		
		if (duplicateCheck.rows.length > 0) {
			return json({ 
				success: false, 
				error: 'A business with this GSTN already exists. Please check your GSTN or contact support if you believe this is an error.' 
			}, { status: 400 });
		}

		// Set default values for non-form fields
		const rscore = 0; // Default value for rscore
		const isvisible = 0; // Assuming 1 means visible
		const tag = 'blank'; // Default tag
		const slug = null; // Empty slug for now
		const notes = null; // Empty notes for now
		const login_password = 'businessadminzpassword';

		// If any optional fields are missing, insert NULL for those values
		const insertQuery = `
            INSERT INTO businesses_1 (
                rscore, isvisible, pluscode, phonenumber, whatsapp, email, login_email, website, gstn, state, district, tag, slug, notes, city, businessname, address,
            login_password)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
            RETURNING id
        `;

		// Use NULL for optional fields if they are not provided or empty
		const result = await pool.query(insertQuery, [
			rscore,
			isvisible,
			plusCode || null, // If plusCode is not provided, insert NULL
			phoneNumber,
			whatsappNumber || null, // If whatsappNumber is not provided, insert NULL
			email || null, // If email is not provided, insert NULL
			login_email || 'admin@example.com',
			website || null, // If website is not provided, insert NULL
			gstn || null, // If GSTN is not provided, insert NULL
			state,
			district,
			tag,
			slug,
			notes,
			city,
			businessName,
			address,
			login_password
		]);

		const businessId = result.rows[0].id;

		// Send confirmation email via the new endpoint
		await fetch('/api/sendBusinessSubmissionConfirmation', {
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
				district,
				city
			})
		});

		return json({ success: true, id: businessId });
	} catch (error) {
		console.error('Error inserting business data:', error);
		return json({ success: false, error: 'Failed to submit business' }, { status: 500 });
	}
}
