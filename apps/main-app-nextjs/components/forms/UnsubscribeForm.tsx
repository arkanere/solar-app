/* eslint-disable-next-line no-restricted-syntax -- Interactive leaf. A confirm button that posts and swaps itself for a receipt. Submitting/error/done state reacting to a click, which a server component cannot do. */
'use client';

/**
 * The opt-out confirmation. Ported from the interactive half of
 * apps/main-app/src/routes/[country=country]/(layout-1)/unsubscribe/+page.svelte.
 *
 * THE ADDRESS IS A PROP, not something this reads from the URL. The original
 * pulled `?unsubscribe=` in `onMount`, which meant the first paint said
 * "unsubscribe **(nothing)**" and the button was disabled until hydration.
 * The page reads the query on the server instead — the same call
 * `/{cc}/thank-you` makes for its `?ref` — so the address is in the HTML and
 * the empty case is a different page, not a dead button.
 *
 * ONE CLICK, NOT A FORM. There is nothing to type: the visitor either
 * confirms the address we mailed or they do not. It is still a <form> so the
 * button submits on Enter and the browser announces it as an action.
 *
 * Two departures, both the ones DataRequestForm records: errors render in
 * place rather than in an alert, and the endpoint's own message is repeated
 * when it has one.
 */
import { useState } from 'react';

export function UnsubscribeForm({ email }: { email: string }) {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const body = await response.json().catch(() => null);

      if (!response.ok || !body?.success) {
        throw new Error(body?.error ?? `/api/unsubscribe returned ${response.status}`);
      }

      setDone(true);
    } catch (submitFailure) {
      console.error('Unsubscribe error:', submitFailure);
      setError(
        submitFailure instanceof Error && submitFailure.message
          ? submitFailure.message
          : 'We could not process that just now. Please check your connection and try again.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div
        role="status"
        className="rounded-lg border border-line-strong bg-surface-sunken p-lg font-serif text-prose text-ink-muted"
      >
        <p className="font-semibold text-ink">You have been unsubscribed</p>
        <p className="mt-sm">
          We have removed <strong className="font-semibold text-ink">{email}</strong> from our email
          list. You will not receive any more mail from us at that address.
        </p>
      </div>
    );
  }

  return (
    // `font-sans` is explicit because the page renders this inside a serif
    // prose block — a control is UI, not prose. Same call DataRequestForm makes.
    <form className="flex flex-col gap-md font-sans text-ink" onSubmit={handleSubmit}>
      {error ? (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-md bg-action px-md py-sm text-base font-semibold text-action-ink transition-colors duration-fast ease-standard hover:bg-action-hover disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? 'Processing…' : 'Confirm unsubscription'}
      </button>
    </form>
  );
}
