/**
 * POST /api/unsubscribe — the email opt-out behind `/unsubscribe`. Ported from
 * apps/main-app/src/routes/[country=country]/(layout-1)/unsubscribe/+server.js.
 *
 * **The URL loses its country prefix**, for the reason `submitDataAccess`
 * gives: the `unsubscribe` table has no country column, the page that posts
 * here is country-less too, and the SvelteKit handler's `params.country`
 * check was never read past the guard. Nothing external posts to the old
 * path — the mailed link is a GET carrying `?unsubscribe=`, and
 * `middleware.ts` 301s it here with its query string intact.
 *
 * ONE RULE IS TIGHTER THAN THE ORIGINAL. SvelteKit accepted any non-empty
 * string and put no ceiling on it, while `unsubscribe.email` is
 * `varchar(255)` — so a 256-character value was a database error and
 * therefore a 500, the same hole the README records against
 * `data_deletion_requests`. It is closed here rather than carried across,
 * because unlike that one the fix is local: this schema is not shared with
 * another app. The format check comes with it; every address reaching this
 * endpoint was minted by our own mail.
 *
 * No schema in `@solar/validation` for the same reason — one field, one
 * caller. It earns a home there the day a second app opts someone out.
 */
import { email, parseBody, z } from '@solar/validation';
import { recordUnsubscribe } from '@/lib/server/unsubscribe';

/** An opt-out is a write per request; nothing here may be cached. */
export const dynamic = 'force-dynamic';

const unsubscribeSchema = z.object({
  email: email.max(255, 'Email address must be 255 characters or fewer')
});

export async function POST(request: Request) {
  const parsed = await parseBody(request, unsubscribeSchema);
  if (!parsed.ok) {
    return Response.json(
      { success: false, error: parsed.error, fields: parsed.fields },
      { status: 400 }
    );
  }

  try {
    const { id, alreadyUnsubscribed } = await recordUnsubscribe(parsed.data.email);
    return Response.json({
      success: true,
      id,
      message: alreadyUnsubscribed ? 'Email already unsubscribed' : 'Successfully unsubscribed'
    });
  } catch (error) {
    console.error('Error processing unsubscribe request:', error);
    return Response.json(
      { success: false, error: 'Failed to process unsubscription request' },
      { status: 500 }
    );
  }
}
