// eslint-disable-next-line no-restricted-syntax -- needs usePathname and effects to load trackers and record navigations
'use client';

/**
 * Loads GA and PostHog for a visitor who already accepted, 3 seconds after
 * mount so they stay off the critical path — the SvelteKit delay. A first
 * visit loads them from the banner's Accept instead.
 *
 * Also sends a PostHog pageview on every client navigation. The first
 * pageview is sent by the loader itself, once PostHog is up.
 */
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { capturePageview, loadAnalytics } from '@/lib/analytics';

const DEFER_MS = 3000;

export function Analytics() {
  const pathname = usePathname();
  const firstRender = useRef(true);

  useEffect(() => {
    const timer = setTimeout(loadAnalytics, DEFER_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    capturePageview();
  }, [pathname]);

  return null;
}
