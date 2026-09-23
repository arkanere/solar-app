// eslint-disable-next-line no-restricted-syntax -- needs usePathname and effects to load trackers, record navigations and listen for tracked clicks
'use client';

/**
 * Loads GA and PostHog for a visitor who already accepted, 3 seconds after
 * mount so they stay off the critical path — the SvelteKit delay. A first
 * visit loads them from the banner's Accept instead.
 *
 * Also sends a PostHog pageview on every client navigation. The first
 * pageview is sent by the loader itself, once PostHog is up.
 *
 * And it sends the click events server components declare with `trackAttrs`
 * (lib/track.ts), from one document listener.
 */
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { capture, capturePageview, loadAnalytics } from '@/lib/analytics';

const DEFER_MS = 3000;

export function Analytics() {
  const pathname = usePathname();
  const firstRender = useRef(true);

  useEffect(() => {
    const timer = setTimeout(loadAnalytics, DEFER_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const el = event.target.closest<HTMLElement>('[data-track], [data-umami]');
      if (!el) return;
      const { track, trackProps, umami } = el.dataset;
      if (track) capture(track, trackProps ? JSON.parse(trackProps) : undefined);
      if (umami) window.umami?.track(umami);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
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
