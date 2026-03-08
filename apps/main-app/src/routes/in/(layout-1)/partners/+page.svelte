<script lang="ts">
	import { breadcrumbLD } from '$lib/seo';
	import NetworkStats from '$lib/in/components/seo/NetworkStats.svelte';
	import InstallerTestimonial from '$lib/in/components/seo/InstallerTestimonial.svelte';
	import { Button } from '$lib/components/ui/button';
	import { ArrowRight, Shield, BarChart3, Layout } from '@lucide/svelte';

	let { data } = $props();

	const breadcrumb = breadcrumbLD([
		{ name: 'Home', url: 'https://solarvipani.com/in/' },
		{ name: 'Partners', url: 'https://solarvipani.com/in/partners/' }
	]);

	const benefits = [
		{
			icon: BarChart3,
			title: 'Verified Leads',
			description: 'Receive qualified leads from homeowners actively looking for solar installation in your service area.'
		},
		{
			icon: Layout,
			title: 'Business Dashboard',
			description: 'Manage your profile, track leads, and showcase completed projects from a single dashboard.'
		},
		{
			icon: Shield,
			title: 'Verified Badge',
			description: 'Build trust with a verified installer badge that boosts customer confidence in your business.'
		}
	];

	const testimonials = [
		{
			name: 'Rajesh Kumar',
			business: 'SunPower Solutions',
			district: 'Pune',
			text: 'Since joining Solar Vipani, we have received consistent leads from homeowners in our area. The platform has become our primary source of new customers.'
		},
		{
			name: 'Priya Sharma',
			business: 'GreenTech Solar',
			district: 'Bangalore',
			text: 'The dashboard makes it easy to manage leads and showcase our projects. Our business has grown 40% since listing on the platform.'
		},
		{
			name: 'Amit Patel',
			business: 'SolarEdge India',
			district: 'Ahmedabad',
			text: 'Being a verified installer on Solar Vipani has given us credibility. Customers trust us more when they see the verified badge.'
		}
	];
</script>

<svelte:head>
	<title>Partner with Solar Vipani | India's Solar Installer Network</title>
	<meta
		name="description"
		content="Join India's fastest-growing solar installer network. Get verified leads, showcase your projects, and grow your solar business with Solar Vipani. {data.installerCount}+ installers across {data.citiesServed}+ cities."
	/>
	<link rel="canonical" href="https://solarvipani.com/in/partners/" />
	{@html `<script type="application/ld+json">${JSON.stringify(breadcrumb)}</script>`}
</svelte:head>

<div class="mx-auto max-w-4xl px-4 py-8">
	<!-- Breadcrumb -->
	<nav class="mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
		<ol class="flex flex-wrap gap-1">
			<li><a href="/in/" class="hover:text-primary">Home</a> /</li>
			<li class="font-medium text-foreground">Partners</li>
		</ol>
	</nav>

	<!-- Hero -->
	<section class="mb-10 text-center">
		<h1 class="mb-4 text-3xl font-bold text-primary md:text-4xl">
			Join India's Fastest-Growing Solar Installer Network
		</h1>
		<p class="mx-auto max-w-2xl text-muted-foreground">
			Connect with homeowners actively searching for solar installation. Grow your business with verified leads and a dedicated installer profile.
		</p>
	</section>

	<!-- Network Stats -->
	<section class="mb-10">
		<NetworkStats
			installerCount={data.installerCount}
			citiesServed={data.citiesServed}
			projectsCompleted={data.projectsCompleted}
			leadsGenerated={data.leadsGenerated}
		/>
	</section>

	<!-- Benefits -->
	<section class="mb-10">
		<h2 class="mb-6 text-center text-2xl font-semibold text-foreground">Why Partner with Us</h2>
		<div class="grid gap-4 md:grid-cols-3">
			{#each benefits as benefit}
				<div class="flex flex-col items-center gap-3 rounded-lg border bg-card p-6 text-center">
					<div class="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
						<benefit.icon class="h-6 w-6 text-primary" />
					</div>
					<h3 class="text-lg font-semibold text-foreground">{benefit.title}</h3>
					<p class="text-sm text-muted-foreground">{benefit.description}</p>
				</div>
			{/each}
		</div>
	</section>

	<!-- Testimonials -->
	<section class="mb-10">
		<h2 class="mb-6 text-center text-2xl font-semibold text-foreground">What Our Partners Say</h2>
		<InstallerTestimonial {testimonials} />
	</section>

	<!-- CTA -->
	<section class="rounded-lg bg-primary/5 p-8 text-center">
		<h2 class="mb-3 text-2xl font-semibold text-foreground">Ready to Grow Your Solar Business?</h2>
		<p class="mx-auto mb-6 max-w-lg text-muted-foreground">
			Join {data.installerCount}+ verified installers across {data.citiesServed}+ cities. Start receiving leads today.
		</p>
		<a href="/in/partners/join/">
			<Button class="gap-2">
				Join as Partner <ArrowRight class="h-4 w-4" />
			</Button>
		</a>
	</section>
</div>
