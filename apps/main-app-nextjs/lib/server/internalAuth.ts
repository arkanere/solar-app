/**
 * Shared-secret guard for privileged server-to-server endpoints. Ported from
 * apps/main-app/src/lib/server/internalAuth.ts.
 *
 * Only the guard comes across, not the original's `internalSecretHeaders`.
 * There, `sendLeadSubmissionConfirmation` reached `generateUserMagicLink` over
 * HTTP and had to forward the header; here both call `createUserMagicLink`
 * directly, so nothing in this app is an internal HTTP caller. The route is
 * still reachable from the internet, so it still needs the guard.
 */
import { timingSafeEqual } from 'node:crypto';

export const INTERNAL_SECRET_HEADER = 'x-internal-secret';

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

/** True when the request carries the correct internal secret. */
export function hasInternalSecret(request: Request): boolean {
  const secret = process.env.INTERNAL_API_SECRET;
  if (!secret) return false; // misconfigured -> fail closed
  const provided = request.headers.get(INTERNAL_SECRET_HEADER);
  return provided != null && safeEqual(provided, secret);
}
