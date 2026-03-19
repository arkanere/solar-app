<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { MapPin, Calendar, Hash } from '@lucide/svelte';
	import { formatDate } from '$lib/constants/projectFormatters';
	import LeadFormSection from '$lib/in/components/LeadFormSection.svelte';
	import { breadcrumbLD } from '$lib/seo';
	import { PUBLIC_CLOUDINARY_CLOUD_NAME } from '$env/static/public';

	let { data } = $props();

	const project = $derived(data.project);
	const business = $derived(data.business);
	const stateSlug = $derived(data.stateSlug);
	const districtSlug = $derived(data.districtSlug);

	const pageTitle = $derived(`${project.title} by ${business.businessname}`);
	const metaDescription = $derived(
		`Solar installation project: ${project.title} by ${business.businessname}. ${project.pincode ? `Location: ${project.pincode}.` : ''} ${project.district ? `District: ${project.district}.` : ''}`
	);

	const breadcrumb = $derived(
		breadcrumbLD([
			{ name: 'Home', url: 'https://solarvipani.com/in/' },
			{ name: 'Solar', url: 'https://solarvipani.com/in/solar/' },
			{ name: business.businessname, url: `https://solarvipani.com/in/installer/${business.slug}/` },
			{ name: project.title, url: `https://solarvipani.com/in/project/${project.slug}/` }
		])
	);

	const articleSchema = $derived({
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: project.title,
		url: `https://solarvipani.com/in/project/${project.slug}/`,
		...(project.project_date ? { datePublished: project.project_date } : {}),
		author: { '@type': 'Organization', name: business.businessname },
		publisher: {
			'@type': 'Organization',
			name: 'Solar Vipani',
			logo: { '@type': 'ImageObject', url: 'https://solarvipani.com/logo.png' }
		},
		...(project.cloudinary_public_id
			? {
					image: `https://res.cloudinary.com/${PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${project.cloudinary_public_id}`
				}
			: {})
	});

	function getHeroImage(): string | null {
		if (project.cloudinary_public_id) {
			return `https://res.cloudinary.com/${PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_limit,w_800,q_auto,f_auto/${project.cloudinary_public_id}`;
		}
		return project.image_url || null;
	}

	const heroSrc = getHeroImage();

	const sizeMatch = $derived(project.title.match(/(\d+)\s*kw/i));
	const sizeKw = $derived(sizeMatch ? parseInt(sizeMatch[1]) : null);
</script>

<svelte:head>
	<title>{pageTitle} | Solar Vipani</title>
	<meta name="description" content={metaDescription} />
	<link rel="canonical" href="https://solarvipani.com/in/project/{project.slug}/" />
	{@html `<script type="application/ld+json">${JSON.stringify(breadcrumb)}</script>`}
	{@html `<script type="application/ld+json">${JSON.stringify(articleSchema)}</script>`}
	{#if project.cloudinary_public_id}
		<meta property="og:image" content="https://res.cloudinary.com/{PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/{project.cloudinary_public_id}" />
	{/if}
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-8">
	<!-- Breadcrumb -->
	<nav class="text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
		<ol class="flex flex-wrap gap-1">
			<li><a href="/in/" class="hover:text-primary">Home</a> /</li>
			<li><a href="/in/solar/" class="hover:text-primary">Solar</a> /</li>
			<li><a href="/in/installer/{business.slug}/" class="hover:text-primary">{business.businessname}</a> /</li>
			<li class="text-foreground font-medium">{project.title}</li>
		</ol>
	</nav>

	<!-- Hero Image -->
	{#if heroSrc}
		<div class="mb-8 rounded-xl overflow-hidden shadow-md">
			<img
				src={heroSrc}
				alt={project.title}
				class="w-full h-auto object-contain"
				loading="eager"
			/>
		</div>
	{/if}

	<!-- Project Specs -->
	<h1 class="text-3xl md:text-4xl font-bold text-primary mb-4">{project.title}</h1>

	<div class="flex flex-wrap gap-4 mb-8 text-sm text-muted-foreground">
		{#if project.pincode}
			<span class="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
				<Hash class="w-4 h-4 text-primary" />
				Pincode: {project.pincode}
			</span>
		{/if}
		{#if project.project_date}
			<span class="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
				<Calendar class="w-4 h-4 text-primary" />
				{formatDate(project.project_date)}
			</span>
		{/if}
		{#if project.district}
			<span class="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
				<MapPin class="w-4 h-4 text-primary" />
				{project.district}
			</span>
		{/if}
	</div>

	<!-- Installer Attribution -->
	<section class="mb-8 bg-accent/10 rounded-lg p-6">
		<p class="text-sm text-muted-foreground mb-2">Installed by</p>
		<a href="/in/installer/{business.slug}/" class="text-xl font-semibold text-primary hover:underline">
			{business.businessname}
		</a>
		{#if business.city}
			<p class="text-sm text-muted-foreground mt-1">{business.city}, {business.state}</p>
		{/if}
		<div class="mt-4">
			<Button variant="outline" size="sm" onclick={() => window.location.href = `/in/installer/${business.slug}/`}>
				View Installer Profile
			</Button>
		</div>
	</section>

	<!-- System size guide link -->
	{#if sizeKw}
		<p class="text-sm text-muted-foreground mb-8">
			Learn about {sizeKw}kW systems →
			<a href="/in/rooftop-solar/{sizeKw}kw-system/" class="text-primary hover:underline font-medium">
				Complete {sizeKw}kW Solar System Guide
			</a>
		</p>
	{/if}

	<!-- Location Context -->
	{#if stateSlug && districtSlug && project.district}
		<section class="mb-8">
			<h2 class="text-lg font-semibold text-primary mb-2">Location</h2>
			<p class="text-muted-foreground">
				This project is in
				{#if project.city}
					<a href="/in/solar/{stateSlug}/{districtSlug}/{project.city.toLowerCase().replace(/\s+/g, '-')}/" class="text-primary hover:underline">
						{project.city}
					</a>,
				{/if}
				<a href="/in/solar/{stateSlug}/{districtSlug}/" class="text-primary hover:underline">
					{project.district}
				</a>.
				View more solar installers and projects in this area.
			</p>
		</section>
	{/if}

	<!-- CTA -->
	<LeadFormSection city={business.city || ''} title="Want a Similar System? Get Quotes." hasBusinesses={true} />

	<!-- Get Quotes CTA -->
	<div class="text-center mb-8">
		<a
			href="/in/get-quotes/"
			class="inline-block bg-primary text-primary-foreground font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity"
		>
			Get Free Solar Quotes
		</a>
	</div>

	<!-- Back link -->
	<div class="mt-8">
		<a href="/in/installer/{business.slug}/" class="text-primary hover:underline text-sm">
			← Back to {business.businessname}
		</a>
	</div>
</div>
