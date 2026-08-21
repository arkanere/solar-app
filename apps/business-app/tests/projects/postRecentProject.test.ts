// Regression tests for POST /api/postRecentProject.
//
// Production accumulated 20 projects with a NULL image_url — 7 of them live and
// visible — because nothing at any layer required the image. Two distinct paths
// produced them, and both are covered here:
//
//   1. No image in the request at all. The required-fields check listed title,
//      pincode, date and slug but not the image, so the row went in.
//   2. Cloudinary throwing. The upload was wrapped in a try/catch that logged
//      the error and fell through, inserting an imageless row and returning
//      { success: true } — the business saw "Project posted successfully!".
//
// Cloudinary is the only thing mocked. The insert, the pincode -> district
// lookup and the session check all run for real against Postgres.

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { pool } from '../setup/testDb';
import { createBusiness, createPincodeMapping, resetDatabase } from '../helpers/fixtures';
import { createCookies, createSessionCookies } from '../helpers/request';

const uploadMock = vi.fn();

vi.mock('cloudinary', () => ({
	v2: {
		config: vi.fn(),
		uploader: {
			// The handler calls this callback-style, not as a promise.
			upload: (dataURI: string, options: unknown, callback: (e: unknown, r?: unknown) => void) =>
				uploadMock(dataURI, options, callback)
		}
	}
}));

const { POST } = await import('../../src/routes/api/postRecentProject/+server');

/** Cloudinary succeeds, returning a stub upload result. */
function uploadSucceeds() {
	uploadMock.mockImplementation((_dataURI, _options, callback) =>
		callback(null, {
			secure_url: 'https://res.cloudinary.com/test/image/upload/projects/abc.jpg',
			public_id: 'projects/abc',
			width: 1200,
			height: 900,
			format: 'jpg'
		})
	);
}

/** Cloudinary rejects the upload, as it does for an oversized or bad file. */
function uploadFails() {
	uploadMock.mockImplementation((_dataURI, _options, callback) =>
		callback(new Error('File size too large. Got 14000000. Maximum is 10485760.'))
	);
}

interface PostResponse {
	success: boolean;
	error?: string;
	project?: { id: number; image_url: string | null };
}

async function post(
	session: { id: number; slug: string; businessname: string } | null,
	fields: Record<string, string>,
	image?: { name: string; type: string }
) {
	const formData = new FormData();
	for (const [key, value] of Object.entries(fields)) formData.append(key, value);
	if (image) {
		formData.append(
			'projectImage',
			new File([new Uint8Array([1, 2, 3, 4])], image.name, { type: image.type })
		);
	}

	const response = await POST({
		request: new Request('http://localhost/api/postRecentProject', {
			method: 'POST',
			body: formData
		}),
		cookies: session ? createSessionCookies(session) : createCookies()
	} as never);

	return { status: response.status, body: (await response.json()) as PostResponse };
}

async function countProjects(): Promise<number> {
	const { rows } = await pool.query('SELECT COUNT(*)::int AS count FROM projects');
	return rows[0].count;
}

describe('POST /api/postRecentProject', () => {
	let business: { id: number; slug: string; businessname: string };
	let fields: Record<string, string>;

	beforeEach(async () => {
		await resetDatabase();
		uploadMock.mockReset();

		const id = await createBusiness({ slug: 'trichy-solar', businessname: 'Trichy Solar' });
		business = { id, slug: 'trichy-solar', businessname: 'Trichy Solar' };

		await createPincodeMapping('620019', 'Tiruchirappalli', 'Tamil Nadu');

		fields = {
			projectTitle: '2kW Residential Solar Installation',
			pincode: '620019',
			projectDate: '2026-08-02',
			business_slug: 'trichy-solar'
		};
	});

	it('creates a project when an image is supplied', async () => {
		uploadSucceeds();

		const { status, body } = await post(business, fields, {
			name: 'roof.jpg',
			type: 'image/jpeg'
		});

		expect(status).toBe(200);
		expect(body.success).toBe(true);
		expect(body.project?.image_url).toBe(
			'https://res.cloudinary.com/test/image/upload/projects/abc.jpg'
		);

		const { rows } = await pool.query(
			'SELECT district, image_url, cloudinary_public_id FROM projects'
		);
		expect(rows).toHaveLength(1);
		expect(rows[0].district).toBe('Tiruchirappalli');
		expect(rows[0].image_url).not.toBeNull();
		expect(rows[0].cloudinary_public_id).toBe('projects/abc');
	});

	// Path 1: this is what put projects 109, 113, 121, 159 and 161 into
	// production with no image.
	it('rejects a project with no image instead of inserting an imageless row', async () => {
		const { status, body } = await post(business, fields);

		expect(status).toBe(400);
		expect(body.success).toBe(false);
		expect(body.error).toMatch(/image is required/i);
		expect(await countProjects()).toBe(0);
	});

	// Path 2: the swallowed catch. The caller used to get 200 { success: true }
	// here, with a row already written.
	it('reports a failed Cloudinary upload instead of posting without the image', async () => {
		uploadFails();

		const { status, body } = await post(business, fields, {
			name: 'gps-map-camera.jpg',
			type: 'image/jpeg'
		});

		expect(status).toBe(502);
		expect(body.success).toBe(false);
		expect(body.error).toMatch(/image upload failed/i);
		expect(await countProjects()).toBe(0);
	});

	it('still rejects an unauthenticated caller', async () => {
		uploadSucceeds();

		const { status } = await post(null, fields, { name: 'roof.jpg', type: 'image/jpeg' });

		expect(status).toBe(401);
		expect(await countProjects()).toBe(0);
	});

	it("still rejects posting to another business's slug", async () => {
		uploadSucceeds();
		await createBusiness({ slug: 'other-solar', businessname: 'Other Solar' });

		const { status } = await post(
			business,
			{ ...fields, business_slug: 'other-solar' },
			{ name: 'roof.jpg', type: 'image/jpeg' }
		);

		expect(status).toBe(403);
		expect(await countProjects()).toBe(0);
	});
});
