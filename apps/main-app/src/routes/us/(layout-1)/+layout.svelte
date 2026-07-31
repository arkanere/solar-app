<script>
	import { initializeTheme } from '$lib/themeStore.svelte';
	import { browser } from '$app/environment';
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
	import { afterNavigate } from '$app/navigation';
	import { initPosthog, capturePageview } from '$lib/posthog';
	import { hasAnalyticsConsent } from '$lib/consent';
	import CookieConsent from '$lib/components/CookieConsent.svelte';
	import AboutSolarVipani from '$lib/components/AboutSolarVipani.svelte';
	import SiteHeader from '$lib/components/chrome/SiteHeader.svelte';
	import SiteFooter from '$lib/components/chrome/SiteFooter.svelte';

	let { children, data } = $props();

	// Create a shared store for chat messages
	const chatMessages = writable([]);

	// Only load component client-side to avoid SSR issues
	let showChat = false;

	// Initialize the theme when the component is mounted
	onMount(() => {
		initializeTheme();
		// Only show the chat widget after the page has loaded
		showChat = true;
		// Initialize Vercel Speed Insights
		injectSpeedInsights();

		// Use requestIdleCallback for optimal performance - load analytics when browser is idle
		// This prevents blocking the main thread and improves TBT (Total Blocking Time).
		// Gated on analytics consent — the CookieConsent banner triggers the load on Accept.
		const maybeLoadAnalytics = () => {
			if (hasAnalyticsConsent()) loadAllAnalytics();
		};
		if ('requestIdleCallback' in window) {
			requestIdleCallback(() => maybeLoadAnalytics(), { timeout: 5000 });
		} else {
			// Fallback for Safari and older browsers
			setTimeout(() => maybeLoadAnalytics(), 5000);
		}

		trackEngagement();
	});

	afterNavigate(({ to }) => {
		if (to?.url) capturePageview(to.url.href);
	});

	function trackEngagement() {
		let visibleMs = 0;
		let hadInteraction = false;
		let fired = false;
		let lastVisible = document.visibilityState === 'visible' ? Date.now() : 0;

		function onInteraction() { hadInteraction = true; }
		document.addEventListener('scroll', onInteraction, { once: true, passive: true });
		document.addEventListener('mousemove', onInteraction, { once: true, passive: true });
		document.addEventListener('touchstart', onInteraction, { once: true, passive: true });

		document.addEventListener('visibilitychange', () => {
			if (document.visibilityState === 'hidden' && lastVisible) {
				visibleMs += Date.now() - lastVisible;
				lastVisible = 0;
			} else if (document.visibilityState === 'visible') {
				lastVisible = Date.now();
			}
		});

		const interval = setInterval(() => {
			if (fired) { clearInterval(interval); return; }
			const total = visibleMs + (lastVisible ? Date.now() - lastVisible : 0);
			if (total >= 10000 && hadInteraction && window.umami) {
				window.umami.track('engaged');
				fired = true;
				clearInterval(interval);
			}
		}, 2000);
	}

	function loadAllAnalytics() {
		// Priority 1: PostHog + Core analytics
		initPosthog();
		capturePageview(window.location.href);
		loadGoogleAnalytics();
		loadUmami();

		// Priority 2: Lower priority analytics and widgets (load 1 second later)
		setTimeout(() => {
			loadHotjar();
			loadTwitterPixel();
			loadFacebookPixel();
			loadCallSafe();
		}, 1000);
	}

	function loadUmami() {
		if (typeof window !== 'undefined' && !document.querySelector('script[data-website-id]')) {
			const script = document.createElement('script');
			script.src = 'https://cloud.umami.is/script.js';
			script.setAttribute('data-website-id', 'd592f22f-fdfe-470a-9cd7-fc46022d46ec');
			document.head.appendChild(script);
		}
	}

	function loadGoogleAnalytics() {
		if (typeof window !== 'undefined' && !window.gtag) {
			const script = document.createElement('script');
			script.async = true;
			script.src = 'https://www.googletagmanager.com/gtag/js?id=G-BXXPPJ3LK8';
			document.head.appendChild(script);

			window.dataLayer = window.dataLayer || [];
			function gtag() {
				dataLayer.push(arguments);
			}
			window.gtag = gtag;
			gtag('js', new Date());
			gtag('config', 'G-BXXPPJ3LK8');
		}
	}

	function loadHotjar() {
		if (typeof window !== 'undefined' && !window.hj) {
			(function (h, o, t, j, a, r) {
				h.hj =
					h.hj ||
					function () {
						(h.hj.q = h.hj.q || []).push(arguments);
					};
				h._hjSettings = { hjid: 5045118, hjsv: 6 };
				a = o.getElementsByTagName('head')[0];
				r = o.createElement('script');
				r.async = 1;
				r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
				a.appendChild(r);
			})(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');
		}
	}

	function loadTwitterPixel() {
		if (typeof window !== 'undefined' && !window.twq) {
			!(function (e, t, n, s, u, a) {
				e.twq ||
					((s = e.twq =
						function () {
							s.exe ? s.exe.apply(s, arguments) : s.queue.push(arguments);
						}),
					(s.version = '1.1'),
					(s.queue = []),
					(u = t.createElement(n)),
					(u.async = !0),
					(u.src = 'https://static.ads-twitter.com/uwt.js'),
					(a = t.getElementsByTagName(n)[0]),
					a.parentNode.insertBefore(u, a));
			})(window, document, 'script');
			window.twq('config', 'opkvk');
		}
	}

	function loadFacebookPixel() {
		if (
			typeof window !== 'undefined' &&
			!window.fbq &&
			!document.querySelector('script[src*="fbevents.js"]')
		) {
			const script = document.createElement('script');
			script.src = 'https://connect.facebook.net/en_US/fbevents.js';
			document.head.appendChild(script);
		}
	}

	function loadCallSafe() {
		if (typeof window !== 'undefined' && !document.querySelector('script[src*="callsafe.online"]')) {
			const script = document.createElement('script');
			script.src = 'https://www.callsafe.online/embed.js';
			script.setAttribute('data-handle', 'eb37507909fa43ff');
			script.setAttribute('data-source-id', 'solar-vipani');
			document.head.appendChild(script);
		}
	}
</script>

<!-- svelte-ignore a11y_img_redundant_alt -->
<svelte:head>
	<!-- All analytics scripts removed from head to improve TBT (Total Blocking Time) -->
	<!-- They are now loaded via requestIdleCallback in onMount() for optimal performance -->
	<!-- This reduces initial page blocking from ~680ms to ~100-150ms -->
</svelte:head>

<SiteHeader country={data.country} />

{@render children()}

<!-- About Solar Vipani (shown on every page in this layout).
     No stats: this layout deliberately has no aboutStats loader, and the
     component makes them optional for exactly that reason (stage 15c of
     docs/migration-plan-in-country.md). -->
<div class="mx-auto max-w-[1140px] px-[theme(--container-padding)]">
	<AboutSolarVipani />
</div>

<SiteFooter country={data.country} />

<!-- Analytics consent banner — gates loadAllAnalytics() on first visit -->
<CookieConsent onAccept={loadAllAnalytics} />
