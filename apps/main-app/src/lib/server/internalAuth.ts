import { timingSafeEqual } from 'node:crypto';
import { env } from '$env/dynamic/private';

/**
 * Shared-secret guard for privileged server-to-server endpoints.
 *
 * Token-minting endpoints (generateUserMagicLink) must not be callable by
 * anonymous clients — doing so lets an attacker obtain a working sign-in link.
 * They are only invoked internally (e.g. sendLeadSubmissionConfirmation) via
 * `event.fetch`, which forwards the `x-internal-secret` header set below.
 */

export const INTERNAL_SECRET_HEADER = 'x-internal-secret';

function safeEqual(a: string, b: string): boolean {
	const ab = Buffer.from(a);
	const bb = Buffer.from(b);
	return ab.length === bb.length && timingSafeEqual(ab, bb);
}

/** True when the request carries the correct internal secret. */
export function hasInternalSecret(request: Request): boolean {
	const secret = env.INTERNAL_API_SECRET;
	if (!secret) return false; // misconfigured → fail closed
	const provided = request.headers.get(INTERNAL_SECRET_HEADER);
	return provided != null && safeEqual(provided, secret);
}

/** Header object for internal callers to attach to their fetch. */
export function internalSecretHeaders(): Record<string, string> {
	return { [INTERNAL_SECRET_HEADER]: env.INTERNAL_API_SECRET ?? '' };
}
