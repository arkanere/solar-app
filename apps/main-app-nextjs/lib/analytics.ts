/**
 * GA and PostHog — the trackers behind the consent banner. Client-only.
 *
 * `loadAnalytics` is the one entry point, and it refuses without consent. The
 * banner calls it on Accept; `Analytics` calls it on a later visit by someone
 * who already accepted. Umami and CallSafe load separately and are not gated.
 *
 * posthog-js is ~195KB, so it is a dynamic import: nobody who declines, and
 * no first paint, pays for it.
 */
import type { PostHog } from 'posthog-js';
import { getConsent } from '@/lib/consent';

const GA_ID = 'G-BXXPPJ3LK8';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let posthog: PostHog | null = null;
let loaded = false;

export function loadAnalytics() {
  if (loaded || getConsent() !== 'accepted') return;
  loaded = true;
  loadGoogleAnalytics();
  void loadPosthog();
}

/** A PostHog custom event. A no-op until PostHog has loaded, so without consent. */
export function capture(event: string, properties?: Record<string, unknown>) {
  posthog?.capture(event, properties);
}

/** PostHog pageview. A no-op until PostHog has loaded. */
export function capturePageview() {
  posthog?.capture('$pageview', { $current_url: window.location.href });
}

function loadGoogleAnalytics() {
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  // gtag.js reads `arguments` objects off dataLayer, not arrays — this must
  // stay a function expression that pushes `arguments`.
  window.gtag = function () {
    window.dataLayer!.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID);
}

async function loadPosthog() {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return;
  const ph = (await import('posthog-js')).default;
  ph.init(key, {
    api_host: 'https://us.i.posthog.com',
    capture_pageview: false, // manual — `Analytics` sends one per navigation
    capture_pageleave: true,
    session_recording: {
      maskAllInputs: false,
      maskInputOptions: { password: true }
    },
    autocapture: true,
    person_profiles: 'identified_only'
  });
  posthog = ph;
  capturePageview();
}
