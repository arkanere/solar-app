<script>
	import { isDarkMode } from '$lib/in/themeStore'; // Import dark mode state from your store
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

<main class={darkMode ? 'dark' : 'light'}>
	{#if error}
		<h1>Details not found</h1>
		<p>The requested information could not be found. Please contact us if you need assistance.</p>
		<p>
			If you'd like to speak with us, feel free to give us a call at <a
				href="tel:+918983066701">+91 8983066701</a
			>
		</p>
	{:else}
		<h1>We have received your details.</h1>
		
		<!-- Customer details section -->
		{#if customerDetails}
		<div class="customer-details">
			<div class="details-card">
				<div class="detail-row">
					<span class="label">Name:</span>
					<span class="value">{customerDetails.name}</span>
				</div>
				<div class="detail-row">
					<span class="label">Phone:</span>
					<span class="value">{customerDetails.phone}</span>
				</div>
				<div class="detail-row">
					<span class="label">Email:</span>
					<span class="value">{customerDetails.email || 'Not provided'}</span>
				</div>
				<div class="detail-row">
					<span class="label">Location:</span>
					<span class="value">{customerDetails.pinCode}{customerDetails.district ? `, ${customerDetails.district}` : ''}</span>
				</div>
				<div class="detail-row">
					<span class="label">Installation Type:</span>
					<span class="value">{customerDetails.type}</span>
				</div>
				<div class="detail-row">
					<span class="label">Requirements:</span>
					<span class="value">{customerDetails.comment}</span>
				</div>
				<div class="detail-row">
					<span class="label">Submitted:</span>
					<span class="value">{formatDate(customerDetails.submittedAt)}</span>
				</div>
			</div>
		</div>
		
		{#if customerDetails && !customerDetails.hasVerifiedBusinessInDistrict && customerDetails.district}
			<div class="expansion-notice">
				<h3>Service Area Update</h3>
				<p>We are expanding to <strong>{customerDetails.district}</strong>. We will reach out to you once we have a verified installer there.</p>
			</div>
		{/if}
	{/if}
	
	<h2>Next Steps</h2>
	{#if customerDetails && customerDetails.hasVerifiedBusinessInDistrict}
		<p>
			We will call you within 24 hours to gather the exact requirement and clear any doubts that you
			may have.
		</p>
		<p>
			After gathering your exact requirement, we will reshare your requirement with 2-3 verfied
			intallers in your area so that they can provide you with the quotaion.
		</p>
	{:else if customerDetails && !customerDetails.hasVerifiedBusinessInDistrict}
		<p>
			Once we have verified installers in your district, we will connect you with 2-3 qualified installers who can provide you with competitive quotations.
		</p>
	{:else}
		<p>
			We will call you within 24 hours to gather the exact requirement and clear any doubts that you
			may have.
		</p>
		<p>
			After gathering your exact requirement, we will reshare your requirement with 2-3 verfied
			intallers in your area so that they can provide you with the quotaion.
		</p>
	{/if}
		<p>
			If you'd like to speak with us right away, feel free to give us a call at <a
				href="tel:+918983066701">+91 8983066701</a
			>
		</p>
	{/if}
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
		padding-top: 1rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
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
		font-size: 2rem;
		margin-bottom: 0.5rem;
	}

	h2 {
		font-size: 1.5rem;
		margin: 1rem 0 0.75rem 0;
		color: #0056b3;
	}

	.dark h2 {
		color: #64b5f6;
	}

	p {
		font-size: 1.1rem;
		max-width: 800px;
		margin: 0 auto 0.75rem auto;
	}

	/* Customer Details Styling */
	.customer-details {
		margin: 0.5rem auto;
		max-width: 800px;
		text-align: left;
	}

	.details-card {
		background-color: #ffffff;
		border-radius: 8px;
		padding: 1rem;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		border: 1px solid #e2e8f0;
		margin-top: 0.25rem;
	}

	.dark .details-card {
		background-color: #2d2d2d;
		border-color: #404040;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
	}

	.detail-row {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		padding: 0.5rem 0;
		border-bottom: 1px solid #f1f5f9;
	}

	.dark .detail-row {
		border-bottom-color: #404040;
	}

	.detail-row:last-child {
		border-bottom: none;
	}

	.label {
		font-weight: 600;
		color: #475569;
		min-width: 140px;
		flex-shrink: 0;
	}

	.dark .label {
		color: #94a3b8;
	}

	.value {
		font-weight: 500;
		color: #1e293b;
		text-align: right;
		flex-grow: 1;
		word-wrap: break-word;
		margin-left: 1rem;
	}

	.dark .value {
		color: #e2e8f0;
	}

	/* Expansion Notice Styling */
	.expansion-notice {
		margin: 0.75rem auto;
		max-width: 800px;
		padding: 1rem;
		background-color: #fef3c7;
		border: 1px solid #f59e0b;
		border-radius: 8px;
		text-align: center;
		box-shadow: 0 2px 8px rgba(245, 158, 11, 0.1);
	}

	.dark .expansion-notice {
		background-color: rgba(245, 158, 11, 0.15);
		border-color: #f59e0b;
		box-shadow: 0 2px 8px rgba(245, 158, 11, 0.2);
	}

	.expansion-notice h3 {
		font-size: 1.3rem;
		margin-bottom: 0.75rem;
		color: #92400e;
		font-weight: 600;
	}

	.dark .expansion-notice h3 {
		color: #fbbf24;
	}

	.expansion-notice p {
		color: #78350f;
		font-size: 1rem;
		margin: 0;
		line-height: 1.5;
	}

	.dark .expansion-notice p {
		color: #fcd34d;
	}

	.expansion-notice strong {
		color: #92400e;
		font-weight: 700;
	}

	.dark .expansion-notice strong {
		color: #fbbf24;
	}

	/* Responsive styling for mobile */
	@media (max-width: 768px) {
		h1 {
			font-size: 2rem;
		}

		h2 {
			font-size: 1.5rem;
		}

		p {
			font-size: 1.1rem;
		}

		.customer-details {
			margin: 1.5rem auto;
			max-width: 90%;
		}

		.details-card {
			padding: 1.5rem;
		}

		.detail-row {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.25rem;
		}

		.label {
			min-width: auto;
			font-size: 0.95rem;
		}

		.value {
			text-align: left;
			margin-left: 0;
			font-size: 1rem;
		}

		.expansion-notice {
			margin: 1.5rem auto;
			max-width: 90%;
			padding: 1.25rem;
		}

		.expansion-notice h3 {
			font-size: 1.2rem;
		}

		.expansion-notice p {
			font-size: 0.95rem;
		}
	}
</style>
