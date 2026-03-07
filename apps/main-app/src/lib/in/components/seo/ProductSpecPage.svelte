<script lang="ts">
	import Breadcrumb from './Breadcrumb.svelte';

	let { product, brand, siblingProducts, pillarSlug, pillarName }: {
		product: {
			name: string;
			model_slug: string;
			specs: Record<string, string>;
			price_range_min: number | null;
			price_range_max: number | null;
			datasheet_url: string | null;
		};
		brand: { slug: string; name: string };
		siblingProducts: { model_slug: string; name: string }[];
		pillarSlug: string;
		pillarName: string;
	} = $props();

	const specEntries = $derived(Object.entries(product.specs));
</script>

<div class="max-w-6xl mx-auto px-4 py-8">
	<Breadcrumb items={[
		{ name: 'Home', href: '/in/' },
		{ name: pillarName, href: `/in/${pillarSlug}/` },
		{ name: brand.name, href: `/in/${pillarSlug}/${brand.slug}/` },
		{ name: product.name, href: '' }
	]} />

	<h1 class="text-3xl md:text-4xl font-bold text-primary mb-4">{product.name}</h1>
	<p class="text-muted-foreground mb-6">by {brand.name}</p>

	{#if product.price_range_min && product.price_range_max}
		<div class="bg-accent/10 rounded-lg p-4 mb-6 inline-block">
			<span class="text-sm text-muted-foreground">Price Range: </span>
			<span class="text-lg font-semibold text-primary">
				₹{product.price_range_min.toLocaleString('en-IN')} – ₹{product.price_range_max.toLocaleString('en-IN')}
			</span>
		</div>
	{/if}

	{#if specEntries.length > 0}
		<section class="mb-8">
			<h2 class="text-2xl font-semibold text-primary mb-4">Specifications</h2>
			<div class="border rounded-lg overflow-hidden">
				<table class="w-full text-sm">
					<tbody>
						{#each specEntries as [key, value], i}
							<tr class={i % 2 === 0 ? 'bg-muted/50' : ''}>
								<td class="px-4 py-3 font-medium text-foreground w-1/3">{key}</td>
								<td class="px-4 py-3 text-muted-foreground">{value}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</section>
	{/if}

	{#if product.datasheet_url}
		<a
			href={product.datasheet_url}
			target="_blank"
			rel="noopener noreferrer"
			class="inline-block text-primary hover:underline mb-8"
		>
			Download Datasheet →
		</a>
	{/if}

	{#if siblingProducts.length > 0}
		<section class="mb-8">
			<h2 class="text-2xl font-semibold text-primary mb-4">Other {brand.name} Products</h2>
			<div class="flex flex-wrap gap-2">
				{#each siblingProducts as sibling}
					{#if sibling.model_slug !== product.model_slug}
						<a
							href="/in/{pillarSlug}/{brand.slug}/{sibling.model_slug}/"
							class="text-sm bg-muted rounded-lg px-3 py-1.5 hover:bg-accent hover:text-accent-foreground transition-colors"
						>
							{sibling.name}
						</a>
					{/if}
				{/each}
			</div>
		</section>
	{/if}

	<div class="text-center mt-8 mb-8">
		<a
			href="/in/get-quotes/"
			class="inline-block bg-primary text-primary-foreground font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity"
		>
			Get Free Solar Quotes
		</a>
	</div>
</div>
