<script lang="ts">
	import BillUpload from '$lib/components/BillUpload.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const customerDetails = $derived(data?.customerDetails || null);
	const installers = $derived(data?.installers || []);
	const referenceUuid = $derived(data?.referenceUuid || '');

	function formatDate(dateString: Date | string | null) {
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
	<meta name="description" content="Thank you for submitting your details. We will contact you soon." />
</svelte:head>

<main>
	<h1>Thank you! We've received your details.</h1>

	{#if customerDetails}
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
				<span class="value"
					>{customerDetails.pinCode}{customerDetails.district
						? `, ${customerDetails.district}`
						: ''}</span
				>
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

		<BillUpload
			leadRef={referenceUuid}
			billUrl={customerDetails.billUrl}
			billFormat={customerDetails.billFormat}
		/>
	{/if}

	{#if installers.length > 0}
		<h2>{customerDetails?.isExclusiveLead ? 'Your Solar Installer' : 'Top Solar Installers in Your Area'}</h2>
		<div class="installers-list">
			{#each installers as installer}
				<div class="installer-card">
					<strong>{installer.businessname}</strong>
					{#if installer.address}
						<span class="installer-address">{installer.address}</span>
					{/if}
					{#if installer.phonenumber}
						<a href="tel:{installer.phonenumber}" class="installer-phone">{installer.phonenumber}</a>
					{/if}
				</div>
			{/each}
		</div>
	{/if}

	<h2>Next Steps</h2>

	{#if installers.length > 0}
		<p>One of our verified solar installers in your area will reach out to you shortly. If you'd like to talk to someone right away, you can directly call the installers using the above contact details.</p>
	{:else}
		<p>We're currently expanding to your area and will connect you with a verified installer as soon as one is available.</p>
	{/if}

</main>

<style>
	main {
		max-width: 680px;
		margin: 0 auto;
		padding: 2rem 1rem;
		min-height: 100vh;
		font-family: var(--font-sans);
		color: hsl(var(--foreground));
		text-align: center;
	}

	h1 {
		font-size: 1.8rem;
		font-weight: 600;
		margin-bottom: 1.5rem;
		color: hsl(var(--foreground));
	}

	h2 {
		font-size: 1.4rem;
		font-weight: 600;
		margin: 2rem 0 1rem;
		color: hsl(var(--primary-strong));
	}

	h3 {
		font-size: 1.1rem;
		font-weight: 600;
		margin: 0 0 0.5rem;
	}

	p {
		font-size: 1rem;
		line-height: 1.6;
		color: hsl(var(--foreground-secondary));
		margin-bottom: 0.75rem;
	}

	a {
		color: hsl(var(--primary-strong));
		text-decoration: underline;
	}

	a:hover {
		text-decoration: none;
	}

	.details-card {
		background: hsl(var(--card));
		border: 1px solid hsl(var(--border));
		border-radius: 8px;
		box-shadow: var(--shadow-sm);
		padding: 1.25rem;
		margin-bottom: 1.5rem;
		text-align: left;
	}

	.detail-row {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		padding: 0.6rem 0;
		border-bottom: 1px solid hsl(var(--border));
	}

	.detail-row:last-child {
		border-bottom: none;
	}

	.label {
		font-weight: 600;
		color: hsl(var(--foreground-secondary));
		min-width: 140px;
		flex-shrink: 0;
		font-size: 0.9rem;
	}

	.value {
		font-weight: 500;
		color: hsl(var(--foreground));
		text-align: right;
		flex-grow: 1;
		margin-left: 1rem;
		font-size: 0.9rem;
		word-break: break-word;
	}

	.installers-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-bottom: 1.5rem;
	}

	.installer-card {
		background: hsl(var(--card));
		border: 1px solid hsl(var(--border));
		border-radius: 8px;
		padding: 1rem 1.25rem;
		text-align: left;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.installer-address {
		color: hsl(var(--muted-foreground));
		font-size: 0.875rem;
	}

	.installer-phone {
		color: hsl(var(--primary-strong));
		font-size: 0.875rem;
		font-weight: 500;
	}

	@media (max-width: 576px) {
		h1 {
			font-size: 1.5rem;
		}

		.detail-row {
			flex-direction: column;
			gap: 0.2rem;
		}

		.label {
			min-width: auto;
		}

		.value {
			text-align: left;
			margin-left: 0;
		}
	}
</style>
