<script>
	import { isDarkMode } from '$lib/themeStore'; // Import dark mode state from your store
	let { data } = $props();

	let darkMode = $derived($isDarkMode);

	// Extract customer details from server data
	let customerDetails = $derived(data?.customerDetails || null);
	let error = $derived(data?.error || null);
	
	// Format date for display
	function formatDate(dateString) {
		if (!dateString) return '';
		const date = new Date(dateString);
		return date.toLocaleString('en-IN', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

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

<main class={`min-h-screen pt-4 flex flex-col items-center justify-start text-center transition-colors duration-300 ${darkMode ? 'dark bg-background dark:bg-background text-foreground dark:text-foreground' : 'light bg-background text-foreground'}`}>
	{#if error}
		<h1 class="text-2xl md:text-4xl font-bold mb-2">Details not found</h1>
		<p class="text-base md:text-lg max-w-2xl mx-auto mb-3">The requested information could not be found. Please contact us if you need assistance.</p>
		<p class="text-base md:text-lg max-w-2xl mx-auto mb-3">
			If you'd like to speak with us, feel free to give us a call at <a
				href="tel:+918983066701"
				class="text-primary dark:text-primary underline hover:no-underline"
			>+91 8983066701</a
			>
		</p>
	{:else}
		<h1 class="text-2xl md:text-4xl font-bold mb-4">We have received your details.</h1>

		<!-- Customer details section -->
		{#if customerDetails}
		<div class="w-full max-w-2xl mx-auto mb-6 px-4 text-left">
			<div class="bg-card dark:bg-card rounded-lg shadow-md dark:shadow-card p-4 md:p-6 border border-border dark:border-border">
				<div class="space-y-3">
					<div class="flex flex-col md:flex-row md:justify-between md:items-start pb-3 border-b border-border dark:border-border last:border-b-0">
						<span class="font-semibold text-foreground-secondary dark:text-foreground-secondary md:min-w-[140px] flex-shrink-0">Name:</span>
						<span class="font-medium text-foreground dark:text-foreground md:text-right flex-grow md:ml-4">{customerDetails.name}</span>
					</div>
					<div class="flex flex-col md:flex-row md:justify-between md:items-start pb-3 border-b border-border dark:border-border last:border-b-0">
						<span class="font-semibold text-foreground-secondary dark:text-foreground-secondary md:min-w-[140px] flex-shrink-0">Phone:</span>
						<span class="font-medium text-foreground dark:text-foreground md:text-right flex-grow md:ml-4">{customerDetails.phone}</span>
					</div>
					<div class="flex flex-col md:flex-row md:justify-between md:items-start pb-3 border-b border-border dark:border-border last:border-b-0">
						<span class="font-semibold text-foreground-secondary dark:text-foreground-secondary md:min-w-[140px] flex-shrink-0">Email:</span>
						<span class="font-medium text-foreground dark:text-foreground md:text-right flex-grow md:ml-4">{customerDetails.email || 'Not provided'}</span>
					</div>
					<div class="flex flex-col md:flex-row md:justify-between md:items-start pb-3 border-b border-border dark:border-border last:border-b-0">
						<span class="font-semibold text-foreground-secondary dark:text-foreground-secondary md:min-w-[140px] flex-shrink-0">Location:</span>
						<span class="font-medium text-foreground dark:text-foreground md:text-right flex-grow md:ml-4">{customerDetails.pinCode}{customerDetails.district ? `, ${customerDetails.district}` : ''}</span>
					</div>
					<div class="flex flex-col md:flex-row md:justify-between md:items-start pb-3 border-b border-border dark:border-border last:border-b-0">
						<span class="font-semibold text-foreground-secondary dark:text-foreground-secondary md:min-w-[140px] flex-shrink-0">Installation Type:</span>
						<span class="font-medium text-foreground dark:text-foreground md:text-right flex-grow md:ml-4">{customerDetails.type}</span>
					</div>
					<div class="flex flex-col md:flex-row md:justify-between md:items-start pb-3 border-b border-border dark:border-border last:border-b-0">
						<span class="font-semibold text-foreground-secondary dark:text-foreground-secondary md:min-w-[140px] flex-shrink-0">Requirements:</span>
						<span class="font-medium text-foreground dark:text-foreground md:text-right flex-grow md:ml-4">{customerDetails.comment}</span>
					</div>
					<div class="flex flex-col md:flex-row md:justify-between md:items-start">
						<span class="font-semibold text-foreground-secondary dark:text-foreground-secondary md:min-w-[140px] flex-shrink-0">Submitted:</span>
						<span class="font-medium text-foreground dark:text-foreground md:text-right flex-grow md:ml-4">{formatDate(customerDetails.submittedAt)}</span>
					</div>
				</div>
			</div>
		</div>

		{#if customerDetails && !customerDetails.hasVerifiedBusinessInDistrict && customerDetails.district}
			<div class="w-full max-w-2xl mx-auto mb-6 px-4 py-4 bg-warning/10 dark:bg-warning/20 border border-warning rounded-lg shadow-sm text-center">
				<h3 class="text-lg md:text-xl font-semibold mb-2 text-warning dark:text-warning">Service Area Update</h3>
				<p class="text-sm md:text-base text-warning/90 dark:text-warning/90 leading-relaxed">We are expanding to <strong>{customerDetails.district}</strong>. We will reach out to you once we have a verified installer there.</p>
			</div>
		{/if}
	{/if}

	<h2 class="text-xl md:text-2xl font-bold my-4 text-primary dark:text-primary">Next Steps</h2>
	{#if customerDetails && customerDetails.hasVerifiedBusinessInDistrict}
		<p class="text-base md:text-lg max-w-2xl mx-auto mb-3">
			We will call you within 24 hours to gather the exact requirement and clear any doubts that you
			may have.
		</p>
		<p class="text-base md:text-lg max-w-2xl mx-auto mb-3">
			After gathering your exact requirement, we will reshare your requirement with 2-3 verfied
			intallers in your area so that they can provide you with the quotaion.
		</p>
	{:else if customerDetails && !customerDetails.hasVerifiedBusinessInDistrict}
		<p class="text-base md:text-lg max-w-2xl mx-auto mb-3">
			Once we have verified installers in your district, we will connect you with 2-3 qualified installers who can provide you with competitive quotations.
		</p>
	{:else}
		<p class="text-base md:text-lg max-w-2xl mx-auto mb-3">
			We will call you within 24 hours to gather the exact requirement and clear any doubts that you
			may have.
		</p>
		<p class="text-base md:text-lg max-w-2xl mx-auto mb-3">
			After gathering your exact requirement, we will reshare your requirement with 2-3 verfied
			intallers in your area so that they can provide you with the quotaion.
		</p>
	{/if}
		<p class="text-base md:text-lg max-w-2xl mx-auto mb-3">
			If you'd like to speak with us right away, feel free to give us a call at <a
				href="tel:+918983066701"
				class="text-primary dark:text-primary underline hover:no-underline"
			>+91 8983066701</a
			>
		</p>
	{/if}
</main>
