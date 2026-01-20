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
		fbq('track', 'Lead');
	</script>
	<noscript>
		<!-- svelte-ignore a11y_img_redundant_alt -->
		<img
			height="1"
			width="1"
			style="display:none"
			src="https://www.facebook.com/tr?id=1226087962095221&ev=PageView&noscript=1"
			alt="Facebook Pixel tracking"
		/>
	</noscript>
	<!-- End Meta Pixel Code -->

	<title>Thank You | Solar Vipani</title>
	<meta
		name="description"
		content="Thank you for submitting your details. We will contact you soon."
	/>
</svelte:head>

<main class="pt-12 flex flex-col items-center justify-center min-h-screen text-center bg-background text-foreground">
	<h1 class="text-4xl md:text-5xl font-bold mb-4">Thank you for submitting your details.</h1>
	<p class="text-xl md:text-2xl mb-4">We will call you soon to verify the business details submitted in the form.</p>
	<p class="text-xl md:text-2xl">
		If you'd like to speak with us right away, feel free to give us a call at <a
			href="tel:+918983066701"
			class="text-primary hover:opacity-80 transition-opacity">+91 8983066701</a
		>
	</p>
</main>
