<script lang="ts">
	import { breadcrumbLD } from '$lib/seo';
	import PartnerSignupForm from '$lib/in/components/seo/PartnerSignupForm.svelte';
	import { Users, MapPin, ClipboardCheck, Handshake } from '@lucide/svelte';

	let { data } = $props();

	const breadcrumb = breadcrumbLD([
		{ name: 'Home', url: 'https://solarvipani.com/in/' },
		{ name: 'Partners', url: 'https://solarvipani.com/in/partners/' },
		{ name: 'Join', url: 'https://solarvipani.com/in/partners/join/' }
	]);

	const steps = [
		{ icon: ClipboardCheck, title: 'Submit Details', description: 'Fill out the form with your business information' },
		{ icon: Handshake, title: 'Verification', description: 'Our team reviews and verifies your business' },
		{ icon: Users, title: 'Start Receiving Leads', description: 'Get connected with customers in your area' }
	];
</script>

<svelte:head>
	<title>Join as Solar Installer Partner | Solar Vipani</title>
	<meta
		name="description"
		content="Sign up as a solar installer partner on Solar Vipani. Get verified leads, a dedicated business profile, and grow your solar business across India."
	/>
	<link rel="canonical" href="https://solarvipani.com/in/partners/join/" />
	{@html `<script type="application/ld+json">${JSON.stringify(breadcrumb)}</script>`}
</svelte:head>

<div class="mx-auto max-w-4xl px-4 py-8">
	<!-- Breadcrumb -->
	<nav class="mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
		<ol class="flex flex-wrap gap-1">
			<li><a href="/in/" class="hover:text-primary">Home</a> /</li>
			<li><a href="/in/partners/" class="hover:text-primary">Partners</a> /</li>
			<li class="font-medium text-foreground">Join</li>
		</ol>
	</nav>

	<h1 class="mb-4 text-center text-3xl font-bold text-primary md:text-4xl">
		Become a Solar Vipani Partner
	</h1>
	<p class="mx-auto mb-8 max-w-2xl text-center text-muted-foreground">
		Join our network of verified solar installers. Fill out the form below and our team will get in touch within 48 hours.
	</p>

	<!-- Trust signals -->
	<div class="mb-8 flex flex-wrap justify-center gap-6">
		<div class="flex items-center gap-2 rounded-lg bg-muted px-4 py-2">
			<Users class="h-5 w-5 text-primary" />
			<span class="font-semibold">{data.installerCount}</span>
			<span class="text-muted-foreground">Verified Installers</span>
		</div>
		<div class="flex items-center gap-2 rounded-lg bg-muted px-4 py-2">
			<MapPin class="h-5 w-5 text-primary" />
			<span class="font-semibold">{data.citiesServed}+</span>
			<span class="text-muted-foreground">Cities</span>
		</div>
	</div>

	<div class="flex justify-center">
		<PartnerSignupForm />
	</div>

	<!-- How it works -->
	<section class="mt-12">
		<h2 class="mb-6 text-center text-2xl font-semibold text-foreground">What Happens Next</h2>
		<div class="grid gap-4 md:grid-cols-3">
			{#each steps as step, i}
				<div class="flex flex-col items-center gap-3 rounded-lg border bg-card p-6 text-center">
					<div class="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
						{i + 1}
					</div>
					<h3 class="font-semibold text-foreground">{step.title}</h3>
					<p class="text-sm text-muted-foreground">{step.description}</p>
				</div>
			{/each}
		</div>
	</section>
</div>
