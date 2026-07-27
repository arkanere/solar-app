// Request-body parsing helpers.
//
// Deliberately framework-free: these return plain results and the route
// decides the HTTP shape, so this package never imports SvelteKit.

import { z } from 'zod';

export interface ParseFailure {
	ok: false;
	/**
	 * Single human-readable message. Existing clients read `result.error` as a
	 * string, so this stays a string.
	 */
	error: string;
	/** Field path -> first message, for forms that highlight inputs. */
	fields: Record<string, string>;
}

export type ParseResult<T> = { ok: true; data: T } | ParseFailure;

function fieldMap(error: z.ZodError): Record<string, string> {
	const fields: Record<string, string> = {};
	for (const issue of error.issues) {
		const key = issue.path.map(String).join('.') || '_';
		// Keep the first message per field; later ones are usually knock-ons.
		if (!(key in fields)) fields[key] = issue.message;
	}
	return fields;
}

function failure(error: z.ZodError): ParseFailure {
	const fields = fieldMap(error);
	const first = Object.values(fields)[0] ?? 'Invalid request';
	return { ok: false, error: first, fields };
}

/**
 * Read and validate a JSON request body.
 *
 * Malformed JSON is reported as a validation failure rather than thrown, so
 * routes stop turning it into a 500.
 */
export async function parseBody<T extends z.ZodType>(
	request: Request,
	schema: T
): Promise<ParseResult<z.output<T>>> {
	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return { ok: false, error: 'Request body must be valid JSON', fields: {} };
	}

	const parsed = schema.safeParse(body);
	return parsed.success ? { ok: true, data: parsed.data } : failure(parsed.error);
}

/**
 * Validate without enforcing — logs what would have been rejected and hands
 * back the raw body unchanged.
 *
 * Used on the public lead intake path during the observation window: the real
 * distribution of phone and postal formats reaching that endpoint isn't known
 * yet, and rejecting on a guess would silently drop leads. Once the logs are
 * boring, the call site switches to `parseBody`.
 */
export function inspectBody<T extends z.ZodType>(label: string, schema: T, body: unknown): void {
	const parsed = schema.safeParse(body);
	if (parsed.success) return;

	console.warn(`[validation] ${label} would have been rejected`, {
		fields: fieldMap(parsed.error)
	});
}
