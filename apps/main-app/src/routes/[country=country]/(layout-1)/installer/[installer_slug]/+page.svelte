<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Phone, MessageCircle, MapPin, Mail, Globe, ExternalLink } from '@lucide/svelte';
	import { makeCall, openWhatsApp } from '$lib/constants/businessTracking';
	import { formatDate } from '$lib/constants/projectFormatters';
	import { breadcrumbLD, localBusinessLD } from '$lib/seo';
	import { PUBLIC_CLOUDINARY_CLOUD_NAME } from '$env/static/public';

	let { data } = $props();

	const SERVICE_MAPPING: Record<number, string> = {
		1: 'Solar Panel Installation',
		2: 'Net Metering',
		3: 'Subsidy Documentation',
		4: 'Financing',
		5: 'Cleaning of Solar Panels',
		6: 'Agricultural Solar Installation'
	};

	const BRAND_MAPPING: Record<number, string> = {
		1: 'Waaree Energies',
		2: 'Adani Solar',
		3: 'Tata Power Solar',
		4: 'Vikram Solar',
		5: 'Goldi Solar',
		6: 'RenewSys',
		7: 'Loom Solar'
	};

	const b = $derived(data.business);
	const projects = $derived(data.projects);
	const serviceAreas = $derived(data.serviceAreas);

	const country = $derived(data.country);
	const cc = $derived(country.code);

	const pageTitle = $derived(`${b.businessname} - Solar Installer in ${b.city}, ${b.state}`);
	const metaDescription = $derived(
		`${b.businessname} is a solar panel installer in ${b.city}, ${b.district}. ${b.description ? b.description.slice(0, 120) : 'View projects, services, and contact details.'}`
	);

	const stateSlug = $derived(b.state?.toLowerCase().replace(/ /g, '-') || '');
	const districtSlug = $derived(b.district?.toLowerCase().replace(/ /g, '-') || '');

	// Normalize the stored map value into an absolute Google Maps URL. Some
	// records store only a place name (e.g. "Trichy") or a plus code instead of
	// a full URL, which would otherwise be treated as a relative link and
	// resolve to the current installer path.
	const mapUrl = $derived.by(() => {
		const raw = b.google_maps_link?.trim();
		if (!raw) return '';
		if (/^https?:\/\//i.test(raw)) return raw;
		const query = [raw, b.city, b.state].filter(Boolean).join(', ');
		return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
	});

	const breadcrumb = $derived(
		breadcrumbLD([
			{ name: 'Home', url: `https://solarvipani.com/${cc}/` },
			{ name: 'Solar', url: `https://solarvipani.com/${cc}/solar/` },
			{ name: b.businessname, url: `https://solarvipani.com/${cc}/installer/${b.slug}/` }
		])
	);

	const localBusiness = $derived(
		localBusinessLD({
			name: b.businessname,
			slug: b.slug,
			address: b.address || '',
			city: b.city || '',
			state: b.state || '',
			postalCode: '',
			phone: b.phonenumber || undefined
		})
	);

	function getProjectImageUrl(cloudinaryId: string): string {
		return `https://res.cloudinary.com/${PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_fill,w_300,h_300,q_auto,f_auto/${cloudinaryId}`;
	}
</script>

<svelte:head>
	<title>{pageTitle} | Solar Vipani</title>
	<meta name="description" content={metaDescription} />
	<link rel="canonical" href="https://solarvipani.com/{cc}/installer/{b.slug}/" />
	{@html `<script type="application/ld+json">${JSON.stringify(breadcrumb)}<\u002Fscript>`}
	{@html `<script type="application/ld+json">${JSON.stringify(localBusiness)}<\u002Fscript>`}
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-8">
	<!-- Breadcrumb -->
	<nav class="text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
		<ol class="flex flex-wrap gap-1">
			<li><a href="/{cc}/" class="hover:text-primary">Home</a> /</li>
			<li><a href="/{cc}/solar/" class="hover:text-primary">Solar</a> /</li>
			<li class="text-foreground font-medium">{b.businessname}</li>
		</ol>
	</nav>

	<!-- Header -->
	<header class="mb-8">
		<div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
			<h1 class="text-3xl md:text-4xl font-bold text-primary">{b.businessname}</h1>
			{#if b.tag && b.tag !== 'Blank'}
				<Badge variant="secondary" class="whitespace-nowrap self-start">
					<span class="inline-flex items-center justify-center w-4 h-4 mr-1 rounded-full text-success-foreground bg-success text-xs font-bold">
						✓
					</span>
					{b.tag}
				</Badge>
			{/if}
		</div>

		<div class="flex items-center text-muted-foreground gap-2 mb-4">
			<MapPin class="w-4 h-4 text-primary shrink-0" />
			<span>{b.address || `${b.city}, ${b.district}, ${b.state}`}</span>
		</div>

		{#if b.phonenumber}
			<div class="flex flex-col sm:flex-row gap-3">
				<Button
					variant="default"
					class="bg-destructive hover:bg-destructive-hover"
					onclick={() => makeCall(b.phonenumber, b.city, b.slug)}
				>
					<Phone class="w-4 h-4" />
					CALL NOW
				</Button>
				<Button
					variant="default"
					class="bg-success hover:bg-success-hover"
					onclick={() => openWhatsApp(b.phonenumber, b.city, b.slug)}
				>
					<MessageCircle class="w-4 h-4" />
					WHATSAPP
				</Button>
			</div>
		{/if}
	</header>

	<!-- About -->
	{#if b.description}
		<section class="mb-8">
			<h2 class="text-xl font-semibold text-primary mb-3">About</h2>
			<p class="text-foreground leading-relaxed">{b.description}</p>
		</section>
	{/if}

	<!-- Services & Brands -->
	{#if (b.services?.length > 0) || (b.brands?.length > 0)}
		<section class="mb-8">
			{#if b.services?.length > 0}
				<h2 class="text-xl font-semibold text-primary mb-3">Services</h2>
				<div class="flex flex-wrap gap-2 mb-6">
					{#each b.services as serviceId}
						<span class="bg-accent/10 text-primary px-3 py-1 rounded-md text-sm font-medium border border-accent/30">
							{SERVICE_MAPPING[serviceId] || 'Unknown Service'}
						</span>
					{/each}
				</div>
			{/if}

			{#if b.brands?.length > 0}
				<h2 class="text-xl font-semibold text-primary mb-3">Brands</h2>
				<div class="flex flex-wrap gap-2">
					{#each b.brands as brandId}
						<span class="bg-accent/10 text-primary px-3 py-1 rounded-md text-sm font-medium border border-accent/30">
							{BRAND_MAPPING[brandId] || 'Unknown Brand'}
						</span>
					{/each}
				</div>
			{/if}
		</section>
	{/if}

	<!-- Service Areas -->
	{#if serviceAreas.length > 0}
		<section class="mb-8">
			<h2 class="text-xl font-semibold text-primary mb-3">Service Areas</h2>
			<div class="flex flex-wrap gap-2">
				{#each serviceAreas as area}
					<a
						href="/{cc}/solar/{area.state_slug}/{area.district_slug}/{area.city_slug}/"
						class="bg-muted px-3 py-1.5 rounded-lg text-sm font-medium hover:text-primary hover:bg-muted/80 transition-colors"
					>
						{area.city}
					</a>
				{/each}
			</div>
		</section>
	{/if}

	<!-- Projects Gallery -->
	{#if projects.length > 0}
		<section class="mb-8">
			<h2 class="text-xl font-semibold text-primary mb-4">
				Recent Projects ({projects.length})
			</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{#each projects as project (project.id)}
					<a href="/{cc}/project/{project.project_slug}/" rel="noopener" class="group">
						<Card.Root class="overflow-hidden h-full hover:shadow-md transition-shadow">
							<div class="aspect-square overflow-hidden">
								{#if project.cloudinary_public_id}
									<img
										src={getProjectImageUrl(project.cloudinary_public_id)}
										alt="{project.title}"
										class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
										loading="lazy"
									/>
								{:else if project.image_url}
									<img
										src={project.image_url}
										alt="{project.title}"
										class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
										loading="lazy"
									/>
								{:else}
									<div class="w-full h-full flex items-center justify-center bg-muted">
										<span class="text-muted-foreground">No Image</span>
									</div>
								{/if}
							</div>
							<Card.Content class="pt-4">
								<h3 class="line-clamp-2 text-primary font-semibold text-lg mb-2">{project.title}</h3>
								<div class="text-muted-foreground text-sm space-y-1">
									{#if project.pincode}<p>Pincode: {project.pincode}</p>{/if}
									<p>Completed: {formatDate(project.project_date)}</p>
								</div>
							</Card.Content>
						</Card.Root>
					</a>
				{/each}
			</div>
		</section>
	{/if}

	<!-- Contact & Location -->
	<section class="mb-8">
		<h2 class="text-xl font-semibold text-primary mb-4">Contact & Location</h2>
		<Card.Root>
			<Card.Content class="pt-6">
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
					{#if b.phonenumber}
						<div class="flex items-start gap-3">
							<Phone class="w-5 h-5 text-primary shrink-0 mt-0.5" />
							<div>
								<p class="text-sm text-muted-foreground font-medium">Phone</p>
								<a href="tel:{b.phonenumber}" class="text-primary hover:underline">{b.phonenumber}</a>
							</div>
						</div>
					{/if}
					{#if b.email}
						<div class="flex items-start gap-3">
							<Mail class="w-5 h-5 text-primary shrink-0 mt-0.5" />
							<div>
								<p class="text-sm text-muted-foreground font-medium">Email</p>
								<a href="mailto:{b.email}" class="text-primary hover:underline break-all">{b.email}</a>
							</div>
						</div>
					{/if}
					{#if b.website}
						<div class="flex items-start gap-3">
							<Globe class="w-5 h-5 text-primary shrink-0 mt-0.5" />
							<div>
								<p class="text-sm text-muted-foreground font-medium">Website</p>
								<a href={b.website} target="_blank" rel="noopener noreferrer" class="text-primary hover:underline break-all">{b.website}</a>
							</div>
						</div>
					{/if}
					{#if b.address}
						<div class="flex items-start gap-3">
							<MapPin class="w-5 h-5 text-primary shrink-0 mt-0.5" />
							<div>
								<p class="text-sm text-muted-foreground font-medium">Address</p>
								<span>{b.address}</span>
							</div>
						</div>
					{/if}
					{#if mapUrl}
						<div class="flex items-start gap-3">
							<ExternalLink class="w-5 h-5 text-primary shrink-0 mt-0.5" />
							<div>
								<p class="text-sm text-muted-foreground font-medium">Map</p>
								<a href={mapUrl} target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">View on Google Maps</a>
							</div>
						</div>
					{/if}
				</div>
			</Card.Content>
		</Card.Root>
	</section>

	<!-- Get Quotes CTA -->
	{#if cc === 'in'}
		<div class="text-center mb-8">
			<a
				href="/{cc}/get-quotes/"
				class="inline-block bg-primary text-primary-foreground font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity"
			>
				Get Free Solar Quotes
			</a>
		</div>
	{/if}

	<!-- Back link -->
	{#if stateSlug && districtSlug}
		<div class="mt-8">
			<a href="/{cc}/solar/{stateSlug}/{districtSlug}/" class="text-primary hover:underline text-sm">
				← All installers in {b.district}
			</a>
		</div>
	{/if}
</div>
