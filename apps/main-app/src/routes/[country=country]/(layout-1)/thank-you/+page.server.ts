import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { businessProfiles, leaddata } from '@solar/db/schema';
import { and, count, eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ url, params }) => {
	// IN-only: every query below reads LeadData / business_profiles, and US
	// leads live in us_leaddata. The page renders a plain confirmation without
	// customerDetails, which is what /us has always shown.
	if (params.country !== 'in') {
		return { customerDetails: null };
	}

	const referenceUuid = url.searchParams.get('ref');

	if (!referenceUuid) {
		return { customerDetails: null };
	}

	try {
		const leadRows = await db
			.select({
				id: leaddata.id,
				name: leaddata.name,
				phone: leaddata.phone,
				pinCode: leaddata.pinCode,
				type: leaddata.type,
				comment: leaddata.comment,
				email: leaddata.email,
				district: leaddata.district,
				createdAt: leaddata.createdAt,
				isvisible: leaddata.isvisible
			})
			.from(leaddata)
			.where(eq(leaddata.referenceUuid, referenceUuid))
			.limit(1);

		if (leadRows.length === 0) {
			return { customerDetails: null, error: 'Details not found' };
		}

		const lead = leadRows[0];

		if (!lead.isvisible) {
			return { customerDetails: null, error: 'Details not found' };
		}

		let hasVerifiedBusinessInDistrict = false;
		if (lead.district) {
			try {
				const businessRows = await db
					.select({ business_count: count() })
					.from(businessProfiles)
					.where(
						and(
							eq(businessProfiles.level2, lead.district),
							eq(businessProfiles.isvisible, true)
						)
					);
				hasVerifiedBusinessInDistrict = businessRows[0].business_count > 0;
			} catch (businessError) {
				console.error('Error checking businesses in district:', businessError);
				hasVerifiedBusinessInDistrict = true;
			}
		} else {
			hasVerifiedBusinessInDistrict = true;
		}

		return {
			customerDetails: {
				id: lead.id,
				name: lead.name,
				phone: lead.phone,
				pinCode: lead.pinCode,
				type: lead.type,
				comment: lead.comment,
				email: lead.email,
				district: lead.district,
				submittedAt: lead.createdAt,
				hasVerifiedBusinessInDistrict
			}
		};
	} catch (err) {
		console.error('Error fetching lead details:', err);
		return { customerDetails: null };
	}
};
