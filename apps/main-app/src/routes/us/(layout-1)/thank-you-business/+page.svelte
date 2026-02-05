<script>
	import { isDarkMode } from '$lib/us/themeStore'; // Import dark mode state from your store
	let darkMode;
	$: darkMode = $isDarkMode;
</script>

<!-- svelte-ignore a11y-img-redundant-alt -->
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
		<img
			height="1"
			width="1"
			style="display:none"
			src="https://www.facebook.com/tr?id=1226087962095221&ev=PageView&noscript=1"
			alt="Facebook Pixel tracking image for PageView event"
		/>
	</noscript>
	<!-- End Meta Pixel Code -->

	<title>Thank You | Solar Vipani</title>
	<meta
		name="description"
		content="Thank you for submitting your details. We will contact you soon."
	/>
</svelte:head>

<main class={darkMode ? 'dark' : 'light'}>
	<h1>Thank you for submitting your details.</h1>
	<p>
		We will verify the business details submitted in the form. Our response time is 2 business days
	</p>
	<p>After successful verification we will list your business in the directory on Solar Vipani.</p>
</main>

<style>
	/* Root variables for light and dark modes */
	:root {
		--light-bg-color: #f8f9fa; /* Soft light background */
		--dark-bg-color: #1a1a1a; /* Dark background */
		--light-primary-text-color: #333; /* Dark text for light mode */
		--dark-primary-text-color: #f0f0f0; /* Light text for dark mode */
		--font-family: 'Helvetica Neue', Arial, sans-serif;
	}

	main {
		padding-top: 3rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 100vh; /* Ensure full viewport height */
		text-align: center;
		font-family: var(--font-family);
		transition:
			background-color 0.3s ease,
			color 0.3s ease;
	}

	/* Light mode */
	.light {
		background-color: var(--light-bg-color);
		color: var(--light-primary-text-color);
	}

	/* Dark mode */
	.dark {
		background-color: var(--dark-bg-color);
		color: var(--dark-primary-text-color);
	}

	h1 {
		font-size: 2.5rem;
		margin-bottom: 1rem;
	}

	p {
		font-size: 1.25rem;
	}

	/* Responsive styling for mobile */
	@media (max-width: 768px) {
		h1 {
			font-size: 2rem;
		}

		p {
			font-size: 1.1rem;
		}
	}
</style>
