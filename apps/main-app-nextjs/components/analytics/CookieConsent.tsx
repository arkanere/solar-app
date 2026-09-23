// eslint-disable-next-line no-restricted-syntax -- reads localStorage after mount and hides on click
'use client';

/**
 * The analytics consent banner, on every page. Shown only until the visitor
 * picks; Accept loads GA and PostHog on the spot. The choice is read after
 * mount, so the server always renders nothing and there is no hydration
 * mismatch.
 */
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Container } from '@/components/layout';
import { loadAnalytics } from '@/lib/analytics';
import { getConsent, setConsent, type ConsentValue } from '@/lib/consent';

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(getConsent() === null);
  }, []);

  if (!visible) return null;

  const choose = (value: ConsentValue) => {
    setConsent(value);
    setVisible(false);
    if (value === 'accepted') loadAnalytics();
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-md z-50"
    >
      <Container width="narrow">
        <div className="flex flex-wrap items-center justify-between gap-x-md gap-y-sm rounded-lg border border-line bg-surface px-lg py-md text-sm text-ink shadow-overlay">
          <p className="flex-[1_1_16rem]">
            We use cookies and analytics to understand how visitors use Solar Vipani and to improve
            the site. You can accept or decline analytics cookies. See our{' '}
            <Link href="/privacy-policy" className="text-action underline">
              Privacy Policy
            </Link>{' '}
            for details.
          </p>
          <div className="flex shrink-0 gap-xs">
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => choose('declined')}
            >
              Decline
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => choose('accepted')}
            >
              Accept
            </button>
          </div>
        </div>
      </Container>
    </div>
  );
}
