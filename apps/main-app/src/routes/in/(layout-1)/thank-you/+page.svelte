<script>
	import { Card } from '$lib/components/ui/card';
	import { Alert } from '$lib/components/ui/alert';

	let { data } = $props();

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

<main class="min-h-screen pt-[theme(--spacing-sm)] flex flex-col items-center justify-start text-center transition-colors duration-[theme(--transition-default)] bg-background text-foreground">
	{#if error}
		<h1 class="text-[theme(--font-size-2xl)] md:text-[theme(--font-size-4xl)] font-bold mb-[theme(--spacing-sm)]">Details not found</h1>
		<p class="text-[theme(--font-size-base)] md:text-[theme(--font-size-lg)] max-w-2xl mx-auto mb-[theme(--spacing-lg)]">The requested information could not be found. Please contact us if you need assistance.</p>
		<p class="text-[theme(--font-size-base)] md:text-[theme(--font-size-lg)] max-w-2xl mx-auto mb-[theme(--spacing-lg)]">
			If you'd like to speak with us, feel free to give us a call at <a
				href="tel:+918983066701"
				class="text-primary underline hover:no-underline"
			>+91 8983066701</a
			>
		</p>
	{:else}
		<h1 class="text-[theme(--font-size-2xl)] md:text-[theme(--font-size-4xl)] font-bold mb-[theme(--spacing-lg)]">We have received your details.</h1>

		<!-- Customer details section -->
		{#if customerDetails}
		<div class="w-full max-w-2xl mx-auto mb-[theme(--spacing-2xl)] px-[theme(--spacing-sm)] text-left">
			<Card class="p-[theme(--spacing-sm)] md:p-[theme(--spacing-lg)] bg-background-secondary">
				<div class="space-y-[theme(--spacing-lg)]">
					<div class="flex flex-col md:flex-row md:justify-between md:items-start pb-[theme(--spacing-lg)] last:pb-0">
						<span class="font-semibold text-foreground-secondary md:min-w-[140px] flex-shrink-0">Name:</span>
						<span class="font-medium text-foreground md:text-right flex-grow md:ml-[theme(--spacing-lg)]">{customerDetails.name}</span>
					</div>
					<div class="flex flex-col md:flex-row md:justify-between md:items-start pb-[theme(--spacing-lg)] last:pb-0">
						<span class="font-semibold text-foreground-secondary md:min-w-[140px] flex-shrink-0">Phone:</span>
						<span class="font-medium text-foreground md:text-right flex-grow md:ml-[theme(--spacing-lg)]">{customerDetails.phone}</span>
					</div>
					<div class="flex flex-col md:flex-row md:justify-between md:items-start pb-[theme(--spacing-lg)] last:pb-0">
						<span class="font-semibold text-foreground-secondary md:min-w-[140px] flex-shrink-0">Email:</span>
						<span class="font-medium text-foreground md:text-right flex-grow md:ml-[theme(--spacing-lg)]">{customerDetails.email || 'Not provided'}</span>
					</div>
					<div class="flex flex-col md:flex-row md:justify-between md:items-start pb-[theme(--spacing-lg)] last:pb-0">
						<span class="font-semibold text-foreground-secondary md:min-w-[140px] flex-shrink-0">Location:</span>
						<span class="font-medium text-foreground md:text-right flex-grow md:ml-[theme(--spacing-lg)]">{customerDetails.pinCode}{customerDetails.district ? `, ${customerDetails.district}` : ''}</span>
					</div>
					<div class="flex flex-col md:flex-row md:justify-between md:items-start pb-[theme(--spacing-lg)] last:pb-0">
						<span class="font-semibold text-foreground-secondary md:min-w-[140px] flex-shrink-0">Installation Type:</span>
						<span class="font-medium text-foreground md:text-right flex-grow md:ml-[theme(--spacing-lg)]">{customerDetails.type}</span>
					</div>
					<div class="flex flex-col md:flex-row md:justify-between md:items-start pb-[theme(--spacing-lg)] last:pb-0">
						<span class="font-semibold text-foreground-secondary md:min-w-[140px] flex-shrink-0">Requirements:</span>
						<span class="font-medium text-foreground md:text-right flex-grow md:ml-[theme(--spacing-lg)]">{customerDetails.comment}</span>
					</div>
					<div class="flex flex-col md:flex-row md:justify-between md:items-start">
						<span class="font-semibold text-foreground-secondary md:min-w-[140px] flex-shrink-0">Submitted:</span>
						<span class="font-medium text-foreground md:text-right flex-grow md:ml-[theme(--spacing-lg)]">{formatDate(customerDetails.submittedAt)}</span>
					</div>
				</div>
			</Card>
		</div>

		{#if customerDetails && !customerDetails.hasVerifiedBusinessInDistrict && customerDetails.district}
			<Alert class="w-full max-w-2xl mx-auto mb-[theme(--spacing-2xl)] px-[theme(--spacing-sm)] py-[theme(--spacing-sm)] bg-warning/10 border border-warning rounded-[theme(--radius-lg)] shadow-[theme(--shadow-sm)] text-center">
				<h3 class="text-[theme(--font-size-base)] md:text-[theme(--font-size-lg)] font-semibold mb-[theme(--spacing-sm)] text-warning">Service Area Update</h3>
				<p class="text-[theme(--font-size-sm)] md:text-[theme(--font-size-base)] text-warning/90 leading-relaxed">We are expanding to <strong>{customerDetails.district}</strong>. We will reach out to you once we have a verified installer there.</p>
			</Alert>
		{/if}
	{/if}

	<h2 class="text-[theme(--font-size-lg)] md:text-[theme(--font-size-2xl)] font-bold my-[theme(--spacing-lg)] text-primary">Next Steps</h2>
	{#if customerDetails && customerDetails.hasVerifiedBusinessInDistrict}
		<p class="text-[theme(--font-size-base)] md:text-[theme(--font-size-lg)] max-w-2xl mx-auto mb-[theme(--spacing-lg)]">
			We will call you within 24 hours to gather the exact requirement and clear any doubts that you
			may have.
		</p>
		<p class="text-[theme(--font-size-base)] md:text-[theme(--font-size-lg)] max-w-2xl mx-auto mb-[theme(--spacing-lg)]">
			After gathering your exact requirement, we will reshare your requirement with 2-3 verfied
			intallers in your area so that they can provide you with the quotaion.
		</p>
	{:else if customerDetails && !customerDetails.hasVerifiedBusinessInDistrict}
		<p class="text-[theme(--font-size-base)] md:text-[theme(--font-size-lg)] max-w-2xl mx-auto mb-[theme(--spacing-lg)]">
			Once we have verified installers in your district, we will connect you with 2-3 qualified installers who can provide you with competitive quotations.
		</p>
	{:else}
		<p class="text-[theme(--font-size-base)] md:text-[theme(--font-size-lg)] max-w-2xl mx-auto mb-[theme(--spacing-lg)]">
			We will call you within 24 hours to gather the exact requirement and clear any doubts that you
			may have.
		</p>
		<p class="text-[theme(--font-size-base)] md:text-[theme(--font-size-lg)] max-w-2xl mx-auto mb-[theme(--spacing-lg)]">
			After gathering your exact requirement, we will reshare your requirement with 2-3 verfied
			intallers in your area so that they can provide you with the quotaion.
		</p>
	{/if}
		<p class="text-[theme(--font-size-base)] md:text-[theme(--font-size-lg)] max-w-2xl mx-auto mb-[theme(--spacing-lg)]">
			If you'd like to speak with us right away, feel free to give us a call at <a
				href="tel:+918983066701"
				class="text-primary underline hover:no-underline"
			>+91 8983066701</a
			>
		</p>
	{/if}
</main>
