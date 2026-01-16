// export const prerender = 'false';
// import { createPool } from '@vercel/postgres';
// import { POSTGRES_URL } from '$env/static/private';

// // export async function load() {
//   const pool = createPool({ connectionString: POSTGRES_URL });

//   try {
//     // Query to get all states from the database
//     const statesResult = await pool.query(
//       `
//       SELECT DISTINCT state
//       FROM locations
//       ORDER BY state ASC
//       `
//     );

//     const states = statesResult.rows.map(row => row.state);

//     // Return states
//     if (states.length > 0) {
//       return {
//         states
//       };
//     } else {
//       return {
//         errorMessage: 'No states found in the database.'
//       };
//     }
//   } catch (error) {
//     console.error('Database query error:', error);
//     return {
//       errorMessage: 'Failed to load states'
//     };
//   }
// }
