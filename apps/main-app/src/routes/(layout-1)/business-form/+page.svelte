<script>
	import BusinessForm from '$lib/BusinessForm.svelte';
	import { isDarkMode } from '$lib/themeStore'; // Import dark mode state

	$: darkMode = $isDarkMode; // Watch for changes in dark mode state
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

<main class={darkMode ? 'dark' : 'light'}>
	<!-- Business Form Component -->
	<div class="form-container">
		<BusinessForm />
	</div>
</main>

<style>
	/* Root variables for light and dark modes */
	:root {
		--light-bg-color: #f8f9fa; /* Soft light background */
		--dark-bg-color: #1a1a1a; /* Dark background */
		--light-primary-text-color: #333; /* Dark text for light mode */
		--dark-primary-text-color: #f0f0f0; /* Light text for dark mode */
		--accent-color: #ffc107; /* Accent color similar to aeon.co */
		--font-family: 'Helvetica Neue', Arial, sans-serif;
		--light-form-bg: white; /* Form background in light mode */
		--dark-form-bg: #333; /* Form background in dark mode */
		--box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* Subtle shadow */
	}

	/* Main layout styling */
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		padding: 2rem;
		font-family: var(--font-family);
		text-align: center;
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

	/* Form container styling */
	.form-container {
		width: 100%;
		max-width: 600px;
		padding: 2rem;
		border-radius: 8px;
		box-shadow: var(--box-shadow);
		transition: background-color 0.3s ease;
	}

	/* Light mode form container */
	.light .form-container {
		background-color: var(--light-form-bg);
	}

	/* Dark mode form container */
	.dark .form-container {
		background-color: var(--dark-form-bg);
	}

	/* Business info section styling (without box effect) */
</style>
