// eslint-disable-next-line no-restricted-syntax -- needs useEffect for the document click listener
'use client';

/**
 * The CallSafe call widget, on every page. `lazyOnload` waits for the window
 * `load` event, which is when the SvelteKit app injected it too.
 *
 * Widget clicks go to Umami. The ids and class are CallSafe's markup, not
 * ours: if they rename them, the events stop and nothing errors.
 */
import Script from 'next/script';
import { useEffect } from 'react';

export function CallSafe() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const target = event.target;
      if (target.closest('.callsafe-button')) {
        window.umami?.track('callsafe-widget-clicked');
      }
      if (target.id === 'callsafe-mute') {
        window.umami?.track('callsafe-mute-clicked');
      } else if (target.id === 'callsafe-end') {
        window.umami?.track('callsafe-call-ended');
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return (
    <Script
      src="https://www.callsafe.online/embed.js"
      data-handle="eb37507909fa43ff"
      data-source-id="solar-vipani"
      strategy="lazyOnload"
    />
  );
}
