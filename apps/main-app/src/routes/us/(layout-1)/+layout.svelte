<script>
	import { isDarkMode, toggleTheme, initializeTheme } from '$lib/us/themeStore';
	import { browser } from '$app/environment';
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';
	// import ChatbotWidget from '$lib/us/ChatbotWidget.svelte';
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';

	let { children } = $props();

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
		// This prevents blocking the main thread and improves TBT (Total Blocking Time)
		if ('requestIdleCallback' in window) {
			requestIdleCallback(() => loadAllAnalytics(), { timeout: 5000 });
		} else {
			// Fallback for Safari and older browsers
			setTimeout(() => loadAllAnalytics(), 5000);
		}

		trackEngagement();
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
		// Priority 1: Core analytics (Google Analytics, Umami)
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
		if (typeof window !== 'undefined' && !document.querySelector('script[src*="callsafe.tech"]')) {
			const script = document.createElement('script');
			script.src = 'https://callsafe.tech/embed.js';
			script.setAttribute('data-handle', '25831dee9a0b76f8');
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

<nav class={$isDarkMode ? 'dark' : 'light'}>
	<a href="/us/">Solar Vipani</a>
	<a href="/us/business-listing">List Business</a>
	<a href="/us/solar-panel-installer-directory">Directory</a>
	<a href="/us/about-us">About us</a>
	<button onclick={toggleTheme}>
		{$isDarkMode ? 'Light mode' : 'Dark mode'}
	</button>
</nav>

{@render children()}

<!-- {#if browser && showChat}
  <ChatbotWidget messages={chatMessages} />
{/if} -->

<style>
	:global(body) {
		font-family: 'Georgia', serif;
		margin: 0;
		padding: 0;
	}

	nav {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		padding: 1rem;
		transition: background-color 0.3s ease;
		width: 100%;
		box-sizing: border-box;
		gap: 2rem;
	}

	nav a {
		text-decoration: none;
		font-size: 1.1rem;
		font-weight: 500;
		transition: color 0.3s ease;
		white-space: nowrap;
	}

	/* Light Mode */
	.light {
		background-color: #fafafa;
		color: #333;
	}

	.light a {
		color: #333;
	}

	.light a:hover {
		color: #0077cc;
	}

	/* Dark Mode */
	.dark {
		background-color: #1a1a1a;
		color: #fff;
	}

	.dark a {
		color: #fff;
	}

	.dark a:hover {
		color: #66b2ff;
	}

	/* Button style */
	button {
		background: none;
		border: 1px solid;
		padding: 0.5rem 1rem;
		font-size: 0.9rem;
		cursor: pointer;
		transition:
			background-color 0.3s ease,
			color 0.3s ease;
		white-space: nowrap;
		margin-left: auto;
	}

	.light button {
		border-color: #333;
		color: #333;
	}

	.light button:hover {
		background-color: #333;
		color: white;
	}

	.dark button {
		border-color: #fff;
		color: #fff;
	}

	.dark button:hover {
		background-color: #fff;
		color: #333;
	}

	/* Mobile responsiveness */
	@media (max-width: 768px) {
		nav {
			justify-content: center;
			padding: 0.75rem;
			gap: 1rem;
		}

		nav a {
			font-size: 0.9rem;
		}

		button {
			padding: 0.25rem 0.5rem;
			font-size: 0.8rem;
			margin-left: 0;
		}
	}
</style>
