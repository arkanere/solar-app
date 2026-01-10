<script lang="ts">
	import { onMount } from 'svelte';
	import { theme } from '$lib/stores/theme.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import type { Snippet } from 'svelte';
	import '../../app.css';

	export type LayoutProps = {
		children: Snippet;
	};

	let { children }: LayoutProps = $props();

	onMount(() => {
		theme.initialize();
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
	<script async="" src="https://connect.facebook.net/en_US/fbevents.js"></script><script>
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
	</script><script async="" src="https://static.hotjar.com/c/hotjar-5045118.js?sv=6"></script>

	<!-- Google tag (gtag.js) -->
	<script async="" src="https://www.googletagmanager.com/gtag/js?id=G-BXXPPJ3LK8"></script>
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
