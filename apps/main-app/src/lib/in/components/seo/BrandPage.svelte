<script lang="ts">
	import Breadcrumb from './Breadcrumb.svelte';
	import FAQ from './FAQ.svelte';

	let { brand, products, pillarSlug, pillarName }: {
		brand: {
			slug: string;
			name: string;
			description: string;
			logo_url: string | null;
			faq: { question: string; answer: string }[] | null;
		};
		products: {
			model_slug: string;
			name: string;
			price_range_min: number | null;
			price_range_max: number | null;
		}[];
		pillarSlug: string;
		pillarName: string;
	} = $props();
</script>

<div class="max-w-6xl mx-auto px-4 py-8">
	<Breadcrumb items={[
		{ name: 'Home', href: '/in/' },
		{ name: pillarName, href: `/in/${pillarSlug}/` },
		{ name: brand.name, href: '' }
	]} />

	<div class="flex items-center gap-4 mb-4">
		{#if brand.logo_url}
			<img src={brand.logo_url} alt="{brand.name} logo" class="h-12 w-auto" />
		{/if}
		<h1 class="text-3xl md:text-4xl font-bold text-primary">{brand.name} — {pillarName}</h1>
	</div>

	{#if brand.description}
		<p class="text-muted-foreground mb-6 max-w-2xl leading-relaxed">{brand.description}</p>
	{/if}

	{#if products.length > 0}
		<section class="mb-8">
			<h2 class="text-2xl font-semibold text-primary mb-4">{brand.name} Products</h2>
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{#each products as product}
					<a
						href="/in/{pillarSlug}/{brand.slug}/{product.model_slug}/"
						class="block border rounded-lg p-4 hover:border-primary hover:shadow-sm transition-all"
					>
						<h3 class="font-medium text-foreground mb-1">{product.name}</h3>
						{#if product.price_range_min && product.price_range_max}
							<p class="text-sm text-muted-foreground">
								₹{product.price_range_min.toLocaleString('en-IN')} – ₹{product.price_range_max.toLocaleString('en-IN')}
							</p>
						{/if}
					</a>
				{/each}
			</div>
		</section>
	{:else}
		<p class="text-muted-foreground mb-8">Product listings for {brand.name} are coming soon.</p>
	{/if}

	<FAQ items={brand.faq ?? []} title="FAQs about {brand.name}" />

	<div class="text-center mt-8 mb-8">
		<a
			href="/in/get-quotes/"
			class="inline-block bg-primary text-primary-foreground font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity"
		>
			Get Free Solar Quotes
		</a>
	</div>
</div>
