/**
 * POST /{cc}/api/generateUserMagicLink.
 *
 * A token-minting endpoint: it returns a working sign-in link, so it is
 * guarded by the shared internal secret and fails closed when the secret is
 * unset. Nothing in this app calls it — `sendLeadSubmissionConfirmation` calls
 * `mintUserMagicLink` directly rather than paying for an HTTP hop to code in
 * the same process. It is kept because it is a published URL (routes.md) and
 * another app may still be pointed at it.
 */
import { isCountry, getCountry } from '@/lib/countries';
import { hasInternalSecret } from '@/lib/server/internalAuth';
import { mintUserMagicLink } from '@/lib/server/magicLink';

/** Writes a token per request; nothing here may be cached or prerendered. */
export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ country: string }> }
) {
  if (!hasInternalSecret(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { country: code } = await params;
  if (!isCountry(code)) {
    return Response.json({ error: 'Unknown country' }, { status: 404 });
  }
  // Customer accounts are IN-only; `mintUserMagicLink` throws rather than
  // write an IN row for another country, so the gate is checked here to
  // answer with a 404 instead of a 500.
  if (!getCountry(code).features.userAccounts) {
    return Response.json(
      { error: 'User accounts are not enabled for this country' },
      { status: 404 }
    );
  }

  try {
    const { email, name } = await request.json();
    if (!email) {
      return Response.json({ error: 'Email is required' }, { status: 400 });
    }

    const magicLinkUrl = await mintUserMagicLink(code, { email, name });

    return Response.json({
      success: true,
      magicLinkUrl,
      message: 'Magic link generated successfully (valid for 15 days)'
    });
  } catch (error) {
    console.error('Error generating user magic link:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
