<script lang="ts">
	import BillUpload from '$lib/components/BillUpload.svelte';
	import AppShell from '$lib/components/ui/AppShell.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import Field from '$lib/components/ui/Field.svelte';
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

<AppShell maxWidth="3xl">
	<Alert variant="success" class="mb-6">
		<strong class="font-semibold">Thank you!</strong> We've received your details.
	</Alert>

	{#if customerDetails}
		<header class="mb-6">
			<h1 class="text-2xl font-semibold text-foreground">Your inquiry</h1>
			<p class="mt-1 text-sm text-muted-foreground">
				Submitted {formatDate(customerDetails.submittedAt)}
			</p>
		</header>

		<div class="space-y-6">
			<Card class="p-5 md:p-6">
				<div class="grid gap-4 md:grid-cols-2">
					<Field label="Name" value={customerDetails.name} />
					<Field label="Phone" value={customerDetails.phone} />
					<Field label="Email" value={customerDetails.email || 'Not provided'} />
					<Field
						label="Location"
						value={`${customerDetails.pinCode}${customerDetails.district ? `, ${customerDetails.district}` : ''}`}
					/>
					<Field label="Installation Type" value={customerDetails.type} />
					<Field label="Requirements" value={customerDetails.comment} class="md:col-span-2" />
				</div>

				<div class="mt-6 border-t border-border pt-6">
					<BillUpload
						leadRef={referenceUuid}
						billUrl={customerDetails.billUrl}
						billFormat={customerDetails.billFormat}
					/>
				</div>
			</Card>
		</div>
	{/if}

	{#if installers.length > 0}
		<section class="mt-10">
			<h2 class="mb-4 text-lg font-semibold text-foreground">
				{customerDetails?.isExclusiveLead
					? 'Your Solar Installer'
					: 'Top Solar Installers in Your Area'}
			</h2>
			<div class="grid gap-4 md:grid-cols-2">
				{#each installers as installer}
					<Card class="flex flex-col p-5">
						<h3 class="text-base font-semibold text-foreground">{installer.businessname}</h3>
						{#if installer.address}
							<p class="mt-1 text-sm text-muted-foreground">{installer.address}</p>
						{/if}
						{#if installer.phonenumber}
							<div class="mt-auto pt-4">
								<a
									href="tel:{installer.phonenumber}"
									class="text-sm font-medium text-primary-strong hover:underline"
								>
									{installer.phonenumber}
								</a>
							</div>
						{/if}
					</Card>
				{/each}
			</div>
		</section>
	{/if}

	<section class="mt-10">
		<h2 class="mb-2 text-lg font-semibold text-foreground">Next Steps</h2>
		<p class="text-sm text-foreground-secondary">
			{#if installers.length > 0}
				One of our verified solar installers in your area will reach out to you shortly. If you'd
				like to talk to someone right away, you can directly call the installers using the above
				contact details.
			{:else}
				We're currently expanding to your area and will connect you with a verified installer as
				soon as one is available.
			{/if}
		</p>
	</section>
</AppShell>
