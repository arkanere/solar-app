/**
 * The email opt-out list. Ported from the `+server.js` that sat beside
 * apps/main-app/src/routes/[country=country]/(layout-1)/unsubscribe/+page.svelte.
 *
 * One table, three columns — `id`, `email`, `created_at`. There is no country
 * column and never was, which is why neither the endpoint nor the page that
 * posts to it is under `/{cc}` here. The SvelteKit handler validated
 * `params.country` and then never read it; the guard was decorative.
 *
 * INSERTING TWICE IS NOT AN ERROR. There is no unique index on `email`, so
 * the original read the row back first and returned success either way rather
 * than stacking duplicates. That is kept: a visitor clicking the same mailed
 * link twice must see the same confirmation, not a failure.
 *
 * The check-then-insert is racy by construction — two clicks landing together
 * can both miss and both insert. That is the live behaviour and the
 * consequence is a duplicate row, which nothing reads back per-row: the list
 * is consumed as a set of addresses. A unique index on `email` would settle
 * it properly and is the right fix whenever that table is next migrated.
 *
 * NOTHING IN THIS APP READS THE LIST BACK. `lib/server/email.ts` sends the
 * lead and business confirmations without consulting it. That is the same
 * hole live SvelteKit has — the suppression happens in Brevo, not here — but
 * it does mean this table is a record of intent, not an enforcement point.
 */
import { unsubscribe } from '@solar/db/schema';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/server/db';

export type UnsubscribeResult = { id: number | null; alreadyUnsubscribed: boolean };

export async function recordUnsubscribe(email: string): Promise<UnsubscribeResult> {
  const [existing] = await db
    .select({ id: unsubscribe.id })
    .from(unsubscribe)
    .where(eq(unsubscribe.email, email))
    .limit(1);

  if (existing) return { id: existing.id, alreadyUnsubscribed: true };

  const [row] = await db
    .insert(unsubscribe)
    .values({ email })
    .returning({ id: unsubscribe.id });

  return { id: row!.id, alreadyUnsubscribed: false };
}
