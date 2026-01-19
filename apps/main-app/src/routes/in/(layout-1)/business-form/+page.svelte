<script>
	import BusinessForm from '$lib/in-new-rewrites/BusinessForm.svelte';
</script>

<!-- svelte-ignore a11y_img_redundant_alt -->
<svelte:head>
	<!-- Meta Pixel Code -->
	<script>
		!(function (f, b, e, v, n, t, s) {
			if (f.fbq) return;
			n = f.fbq = function () {
				n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
			};
			if (!f._fbq) f._fbq = n;
			n.push = n;
			n.loaded = !0;
			n.version = '2.0';
			n.queue = [];
			t = b.createElement(e);
			t.async = !0;
			t.src = v;
			s = b.getElementsByTagName(e)[0];
			s.parentNode.insertBefore(t, s);
		})(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
		fbq('init', '1226087962095221');
		fbq('track', 'PageView');
	</script>
	<noscript>
		<img
			height="1"
			width="1"
			style="display:none"
			src="https://www.facebook.com/tr?id=1226087962095221&ev=PageView&noscript=1"
			alt="Facebook Pixel tracking image for PageView event"
		/>
	</noscript>
	<!-- End Meta Pixel Code -->

	<title>Business Form | Solar Vipani</title>
	<meta
		name="description"
		content="Expand your solar business reach by listing on Solar Vipani. Connect with customers actively seeking solar installation services in your area."
	/>
</svelte:head>

<main class={`min-h-screen flex flex-col items-center justify-center px-4 md:px-8 py-8 transition-colors duration-300 ${darkMode ? 'dark bg-background text-foreground' : 'light bg-background text-foreground'}`}>
	<!-- Business Form Component -->
	<div class="w-full max-w-2xl p-6 md:p-8 rounded-lg shadow-md dark:shadow-card bg-card  transition-colors duration-300">
		<BusinessForm />
	</div>
</main>
