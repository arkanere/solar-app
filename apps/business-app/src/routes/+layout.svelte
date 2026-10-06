<script module lang="ts">
	import type { Snippet } from 'svelte';

	export type LayoutProps = {
		children: Snippet;
	};
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import { theme } from '$lib/stores/theme.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import { capture, capturePageview, loadAnalytics } from '$lib/analytics';
	import '../app.css';

	let { children }: LayoutProps = $props();

	// PostHog loads 3s after mount to stay off the critical path.
	const ANALYTICS_DEFER_MS = 3000;

	onMount(() => {
		theme.initialize();

		const timer = setTimeout(loadAnalytics, ANALYTICS_DEFER_MS);

		// Sends the click events declared with `trackAttrs` (lib/track.ts).
		const onClick = (event: MouseEvent) => {
			if (!(event.target instanceof Element)) return;
			const el = event.target.closest<HTMLElement>('[data-track], [data-umami]');
			if (!el) return;
			const { track, trackProps, umami } = el.dataset;
			if (track) capture(track, trackProps ? JSON.parse(trackProps) : undefined);
			if (umami) window.umami?.track(umami);
		};
		document.addEventListener('click', onClick);

		return () => {
			clearTimeout(timer);
			document.removeEventListener('click', onClick);
		};
	});

	// Pageview per client navigation. The first one is sent by the loader.
	afterNavigate(({ type }) => {
		if (type !== 'enter') capturePageview();
	});
</script>

<!-- svelte-ignore a11y_img_redundant_alt -->
<svelte:head>
	<!-- Umami Analytics - Layout 2 Business -->

	<script
		defer
		src="https://cloud.umami.is/script.js"
		data-website-id="884dd8c2-35ee-4ed8-9426-9be7df3159bf"
	></script>

	<!-- Hotjar Tracking Code for Site 5045118 (name missing) -->
	<script async src="https://connect.facebook.net/en_US/fbevents.js"></script><script>
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
	</script><script async src="https://static.hotjar.com/c/hotjar-5045118.js?sv=6"></script>

	<!-- Google tag (gtag.js) -->
	<script async src="https://www.googletagmanager.com/gtag/js?id=G-BXXPPJ3LK8"></script>
	<script>
		window.dataLayer = window.dataLayer || [];
		function gtag() {
			dataLayer.push(arguments);
		}
		gtag('js', new Date());

		gtag('config', 'G-BXXPPJ3LK8');
	</script>
</svelte:head>

<Toaster richColors position="top-right" />
{@render children?.()}

<style>
	/* Font and base styles are now handled by app.css (Tailwind) */
	/* Note: overflow-x: hidden moved to .layout-container to avoid breaking fixed-position modals */
</style>
