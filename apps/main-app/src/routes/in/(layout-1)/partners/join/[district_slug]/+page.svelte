<script lang="ts">
	import { breadcrumbLD } from '$lib/seo';
	import PartnerSignupForm from '$lib/in/components/seo/PartnerSignupForm.svelte';
	import InstallerTestimonial from '$lib/in/components/seo/InstallerTestimonial.svelte';
	import { Users, MapPin, TrendingUp } from '@lucide/svelte';

	let { data } = $props();

	const breadcrumb = $derived(
		breadcrumbLD([
			{ name: 'Home', url: 'https://solarvipani.com/in/' },
			{ name: 'Partners', url: 'https://solarvipani.com/in/partners/' },
			{ name: 'Join', url: 'https://solarvipani.com/in/partners/join/' },
			{ name: data.district, url: `https://solarvipani.com/in/partners/join/${data.districtSlug}/` }
		])
	);

	const testimonials = $derived([
		{
			name: 'Local Installer',
			business: 'Solar Solutions',
			district: data.district,
			text: `Joining Solar Vipani's network in ${data.district} has helped us tap into the growing demand for rooftop solar. The verified leads save us time and marketing costs.`
		}
	]);

	const nearbyWithInstallers = $derived(
		data.nearbyDistricts.filter((d: { installerCount: number }) => d.installerCount > 0)
	);
</script>

<svelte:head>
	<title>Become a Solar Installer Partner in {data.district} | Solar Vipani</title>
	<meta
		name="description"
		content="Join Solar Vipani's installer network in {data.district}, {data.state}. {data.recentLeadCount > 0 ? `${data.recentLeadCount} homeowners requested solar quotes last month.` : ''} Get verified leads and grow your business."
	/>
	<link rel="canonical" href="https://solarvipani.com/in/partners/join/{data.districtSlug}/" />
	{@html `<script type="application/ld+json">${JSON.stringify(breadcrumb)}</script>`}
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
			<strong class="text-foreground">{data.recentLeadCount} homeowners</strong> in {data.district} requested solar quotes in the last month
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

	<!-- Sign-up form -->
	<div class="flex justify-center">
		<PartnerSignupForm district={data.district} stateName={data.state} />
	</div>

	<!-- Testimonials -->
	<section class="mt-12">
		<h2 class="mb-6 text-center text-2xl font-semibold text-foreground">
			What Installers in {data.state} Say
		</h2>
		<InstallerTestimonial {testimonials} />
	</section>

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
