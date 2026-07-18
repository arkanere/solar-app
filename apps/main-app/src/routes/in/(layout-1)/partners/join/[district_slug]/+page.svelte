<script lang="ts">
	import { breadcrumbLD } from '$lib/seo';
	import BusinessForm from '$lib/in/components/BusinessForm.svelte';
	import { Card } from '$lib/components/ui/card';
	import { Users, MapPin, TrendingUp } from '@lucide/svelte';

	let { data } = $props();

	const breadcrumb = $derived(
		breadcrumbLD([
			{ name: 'Home', url: 'https://solarvipani.com/in/' },
			{ name: 'Partners', url: 'https://solarvipani.com/in/partners/' },
			{ name: 'Join', url: 'https://solarvipani.com/in/partners/join/' },
			{
				name: data.district,
				url: `https://solarvipani.com/in/partners/join/${data.districtSlug}/`
			}
		])
	);

	const nearbyWithInstallers = $derived(
		data.nearbyDistricts.filter((d: { installerCount: number }) => d.installerCount > 0)
	);
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
		fbq('track', 'PageView');
	</script>
	<noscript>
		<img
			height="1"
			width="1"
			style="display:none"
			src="https://www.facebook.com/tr?id=1226087962095221&ev=PageView&noscript=1"
			alt="Facebook Pixel"
		/>
	</noscript>

	<title>Become a Solar Installer Partner in {data.district} | Solar Vipani</title>
	<meta
		name="description"
		content="Join Solar Vipani's installer network in {data.district}, {data.state}. {data.recentLeadCount > 0
			? `${data.recentLeadCount} homeowners requested solar quotes last month.`
			: ''} Get verified leads and grow your business."
	/>
	<link rel="canonical" href="https://solarvipani.com/in/partners/join/{data.districtSlug}/" />
	{@html `<script type="application/ld+json">${JSON.stringify(breadcrumb)}<\u002Fscript>`}
</svelte:head>

<div class="mx-auto max-w-4xl px-4 py-8">
	<!-- Breadcrumb -->
	<nav class="mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
		<ol class="flex flex-wrap gap-1">
			<li><a href="/in/" class="hover:text-primary">Home</a> /</li>
			<li><a href="/in/partners/" class="hover:text-primary">Partners</a> /</li>
			<li><a href="/in/partners/join/" class="hover:text-primary">Join</a> /</li>
			<li class="font-medium text-foreground">{data.district}</li>
		</ol>
	</nav>

	<h1 class="mb-4 text-center text-3xl font-bold text-primary md:text-4xl">
		Become a Solar Installer Partner in {data.district}
	</h1>

	{#if data.recentLeadCount > 0}
		<p class="mx-auto mb-6 max-w-2xl text-center text-lg text-muted-foreground">
			<strong class="text-foreground">{data.recentLeadCount} homeowners</strong> in {data.district}
			requested solar quotes in the last month
		</p>
	{/if}

	<!-- District stats -->
	<div class="mb-8 flex flex-wrap justify-center gap-4">
		<div class="flex items-center gap-2 rounded-lg bg-muted px-4 py-2">
			<Users class="h-5 w-5 text-primary" />
			<span class="font-semibold">{data.installerCount}</span>
			<span class="text-muted-foreground">Installers in {data.district}</span>
		</div>
		<div class="flex items-center gap-2 rounded-lg bg-muted px-4 py-2">
			<MapPin class="h-5 w-5 text-primary" />
			<span class="font-semibold">{data.cityCount}</span>
			<span class="text-muted-foreground">Cities Covered</span>
		</div>
		{#if data.recentLeadCount > 0}
			<div class="flex items-center gap-2 rounded-lg bg-muted px-4 py-2">
				<TrendingUp class="h-5 w-5 text-primary" />
				<span class="font-semibold">{data.recentLeadCount}</span>
				<span class="text-muted-foreground">Recent Quotes</span>
			</div>
		{/if}
	</div>

	<!-- Business Form -->
	<div class="flex justify-center">
		<Card class="w-full max-w-2xl">
			<BusinessForm />
		</Card>
	</div>

	<!-- Nearby districts -->
	{#if nearbyWithInstallers.length > 0}
		<section class="mt-12">
			<h2 class="mb-4 text-center text-xl font-semibold text-foreground">
				Also Recruiting in Nearby Districts
			</h2>
			<div class="flex flex-wrap justify-center gap-2">
				{#each nearbyWithInstallers as d}
					<a
						href="/in/partners/join/{d.slug}/"
						class="rounded-full border px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
					>
						{d.name}
					</a>
				{/each}
			</div>
		</section>
	{/if}
</div>
