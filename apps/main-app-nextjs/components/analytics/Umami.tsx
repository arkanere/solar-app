// eslint-disable-next-line no-restricted-syntax -- needs useEffect for the engaged timer and window listeners
'use client';

/**
 * Umami, on every page. Cookieless, so it loads without consent — unlike the
 * trackers behind the consent banner.
 *
 * Also fires `engaged` once: 10 seconds of visible time plus one scroll,
 * mousemove or touch. Same rule as the SvelteKit app, so the numbers stay
 * comparable across the cutover.
 */
import Script from 'next/script';
import { useEffect } from 'react';

declare global {
  interface Window {
    umami?: { track: (event: string) => void };
  }
}

const ENGAGED_MS = 10_000;

export function Umami() {
  useEffect(() => {
    let visibleMs = 0;
    let hadInteraction = false;
    let lastVisible = document.visibilityState === 'visible' ? Date.now() : 0;

    const onInteraction = () => {
      hadInteraction = true;
    };
    const onVisibility = () => {
      if (document.visibilityState === 'hidden' && lastVisible) {
        visibleMs += Date.now() - lastVisible;
        lastVisible = 0;
      } else if (document.visibilityState === 'visible') {
        lastVisible = Date.now();
      }
    };

    const opts = { once: true, passive: true } as const;
    document.addEventListener('scroll', onInteraction, opts);
    document.addEventListener('mousemove', onInteraction, opts);
    document.addEventListener('touchstart', onInteraction, opts);
    document.addEventListener('visibilitychange', onVisibility);

    const interval = setInterval(() => {
      const total = visibleMs + (lastVisible ? Date.now() - lastVisible : 0);
      if (total >= ENGAGED_MS && hadInteraction && window.umami) {
        window.umami.track('engaged');
        clearInterval(interval);
      }
    }, 2000);

    return () => {
      clearInterval(interval);
      document.removeEventListener('scroll', onInteraction);
      document.removeEventListener('mousemove', onInteraction);
      document.removeEventListener('touchstart', onInteraction);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <Script
      src="https://cloud.umami.is/script.js"
      data-website-id="d592f22f-fdfe-470a-9cd7-fc46022d46ec"
      strategy="afterInteractive"
    />
  );
}
