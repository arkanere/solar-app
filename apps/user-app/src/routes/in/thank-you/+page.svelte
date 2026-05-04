<script>
	/** @type {import('./$types').PageData} */
	export let data;

	$: customerDetails = data?.customerDetails || null;
	$: error = data?.error || null;
	$: installers = data?.installers || [];

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
	<meta name="description" content="Thank you for submitting your details. We will contact you soon." />
</svelte:head>

<main>
	{#if error}
		<h1>Details not found</h1>
		<p>The requested information could not be found. Please contact us if you need assistance.</p>
		<p>
			If you'd like to speak with us, feel free to give us a call at
			<a href="tel:+918983066701">+91 8983066701</a>
		</p>
	{:else}
		<h1>We have received your details.</h1>

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
			<p>One of our verified solar installers in your area will reach out to you in a couple of days to assist you further. In case you are looking to talk to someone right away, you can directly call the installers using the above contact details.</p>
		{:else}
			<p>We are expanding to your area. We will reach out to you once we have a verified installer there.</p>
		{/if}

		<p>
			If you'd like to speak with us right away, feel free to give us a call at
			<a href="tel:+918983066701">+91 8983066701</a>
		</p>
	{/if}
</main>

<style>
	main {
		max-width: 680px;
		margin: 0 auto;
		padding: 2rem 1rem;
		min-height: 100vh;
		font-family: 'Poppins', 'Helvetica Neue', Arial, sans-serif;
		color: #2c3e50;
		text-align: center;
	}

	h1 {
		font-size: 1.8rem;
		font-weight: 600;
		margin-bottom: 1.5rem;
		color: #2c3e50;
	}

	h2 {
		font-size: 1.4rem;
		font-weight: 600;
		margin: 2rem 0 1rem;
		color: #0056b3;
	}

	h3 {
		font-size: 1.1rem;
		font-weight: 600;
		margin: 0 0 0.5rem;
	}

	p {
		font-size: 1rem;
		line-height: 1.6;
		color: #546e7a;
		margin-bottom: 0.75rem;
	}

	a {
		color: #0056b3;
		text-decoration: underline;
	}

	a:hover {
		text-decoration: none;
	}

	.details-card {
		background: #ffffff;
		border: 1px solid #e2e8f0;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
		padding: 1.25rem;
		margin-bottom: 1.5rem;
		text-align: left;
	}

	.detail-row {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		padding: 0.6rem 0;
		border-bottom: 1px solid #f1f5f9;
	}

	.detail-row:last-child {
		border-bottom: none;
	}

	.label {
		font-weight: 600;
		color: #475569;
		min-width: 140px;
		flex-shrink: 0;
		font-size: 0.9rem;
	}

	.value {
		font-weight: 500;
		color: #1e293b;
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
		background: #ffffff;
		border: 1px solid #e2e8f0;
		border-radius: 8px;
		padding: 1rem 1.25rem;
		text-align: left;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.installer-address {
		color: #666;
		font-size: 0.875rem;
	}

	.installer-phone {
		color: #0056b3;
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
