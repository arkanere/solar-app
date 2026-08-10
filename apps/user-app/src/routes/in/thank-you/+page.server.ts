export const prerender = false;
import { and, eq, sql } from 'drizzle-orm';
import { schema } from '@solar/db';
import { db } from '$lib/server/db';
import { getSignedBillUrl } from '$lib/server/billStorage';
import type { PageServerLoad } from './$types';

/** The lead, in the camelCase shape the page renders. */
interface CustomerDetails {
	id: number;
	name: string | null;
	phone: string | null;
	pinCode: string | null;
	type: string | null;
	comment: string | null;
	email: string | null;
	district: string | null;
	submittedAt: Date | null;
	billUrl: string | null;
	billFormat: string | null;
	/**
	 * True when the inquiry came in from an installer's own page, so exactly one
	 * installer is shown. Derived the same way sendLeadSubmissionConfirmation
	 * derives it for the confirmation email — keep the two in step.
	 */
	isExclusiveLead: boolean;
}

const EXCLUSIVE_LEAD_URL = /\/(?:solar-panel-installer|installer)\//;

/** The installer columns the page's card list renders. */
interface Installer {
	businessname: string;
	address: string | null;
	phonenumber: string | null;
}

// `leads.source_id` is nullable in the schema but always set on rows projected
// from leaddata, and `created_at` is a `mode: 'string'` timestamp the driver
// returns as a Date. Both restate the contracts CustomerDetails already
// declares; they render as the bare columns, so the SQL is unchanged.
const LEAD_SELECTION = {
	id: sql<number>`${schema.leads.sourceId}`,
	name: schema.leads.name,
	phone: schema.leads.phone,
	pin_code: schema.leads.postalCode,
	type: schema.leads.type,
	comment: schema.leads.comment,
	email: schema.leads.email,
	district: schema.leads.level2,
	urlparams: schema.leads.urlparams,
	created_at: sql<Date | null>`${schema.leads.createdAt}`,
	isvisible: schema.leads.isvisible,
	bill_cloudinary_public_id: schema.leads.billCloudinaryPublicId,
	bill_format: schema.leads.billFormat
};

// Same reasoning as sendLeadSubmissionConfirmation's copy: `businessname` is
// nullable, but Installer declares it non-null and the page renders it unguarded.
const INSTALLER_SELECTION = {
	businessname: sql<string>`${schema.businessProfiles.businessname}`,
	address: schema.businessProfiles.address,
	phonenumber: schema.businessProfiles.phonenumber
};

export const load: PageServerLoad = async ({ url }) => {
	const pincode = url.searchParams.get('pincode');
	const referenceUuid = url.searchParams.get('ref');

	let customerDetails: CustomerDetails | null = null;
	let installers: Installer[] = [];

	// Look up lead details if ref is provided
	if (referenceUuid) {
		try {
			const rows = await db
				.select(LEAD_SELECTION)
				.from(schema.leads)
				.where(
					and(
						eq(schema.leads.countryCode, 'in'),
						eq(schema.leads.referenceUuid, referenceUuid)
					)
				)
				.limit(1);

			if (rows.length > 0 && rows[0].isvisible) {
				const lead = rows[0];
				customerDetails = {
					id: lead.id,
					name: lead.name,
					phone: lead.phone,
					pinCode: lead.pin_code,
					type: lead.type,
					comment: lead.comment,
					email: lead.email,
					district: lead.district,
					submittedAt: lead.created_at,
					billUrl: getSignedBillUrl(lead.bill_cloudinary_public_id, lead.bill_format),
					billFormat: lead.bill_format,
					isExclusiveLead: EXCLUSIVE_LEAD_URL.test(lead.urlparams ?? '')
				};
			}
		} catch (err) {
			console.error('Error fetching lead details:', err);
		}
	}

	// Look up businesses by pincode (or fall back to lead's district)
	const lookupPincode = pincode || customerDetails?.pinCode;

	if (lookupPincode) {
		try {
			const districtRows = await db
				.select({ district: schema.pincodeMapping.district })
				.from(schema.pincodeMapping)
				.where(eq(schema.pincodeMapping.pincode, lookupPincode))
				.limit(1);

			if (districtRows.length > 0) {
				const district = districtRows[0].district;
				installers = await db
					.select(INSTALLER_SELECTION)
					.from(schema.businessProfiles)
					.where(
						and(
							eq(schema.businessProfiles.countryCode, 'in'),
							// `sql` escape hatches: case-insensitive district compare, and
							// DESC NULLS LAST (Postgres defaults DESC to NULLS FIRST).
							sql`LOWER(${schema.businessProfiles.level2}) = LOWER(${district})`,
							eq(schema.businessProfiles.isvisible, true)
						)
					)
					.orderBy(sql`${schema.businessProfiles.rscore} DESC NULLS LAST`)
					.limit(5);
			}
		} catch {
			// ignore
		}
	}

	return { customerDetails, installers, referenceUuid };
};
