<script lang="ts">
	import ProductSpecPage from '$lib/in/components/seo/ProductSpecPage.svelte';
	import { breadcrumbLD, productLD } from '$lib/seo';

	let { data } = $props();

	const breadcrumb = $derived(breadcrumbLD([
		{ name: 'Home', url: 'https://solarvipani.com/in' },
		{ name: 'Solar Pumps', url: 'https://solarvipani.com/in/solar-pumps' },
		{ name: data.brand.name, url: `https://solarvipani.com/in/solar-pumps/${data.brand.slug}` },
		{ name: data.product.name, url: `https://solarvipani.com/in/solar-pumps/${data.brand.slug}/${data.product.model_slug}` }
	]));

	const productSchema = $derived(productLD({
		name: data.product.name,
		brand: data.brand.name,
		category: 'Solar Pumps',
		price: data.product.price_range_min ?? undefined,
		description: `${data.product.name} by ${data.brand.name}`
	}));
</script>

<svelte:head>
	<title>{data.product.name} — {data.brand.name} | Solar Vipani</title>
	<meta name="description" content="{data.product.name} by {data.brand.name}. View specifications, price range and datasheet." />
	<link rel="canonical" href="https://solarvipani.com/in/solar-pumps/{data.brand.slug}/{data.product.model_slug}" />
	{@html `<script type="application/ld+json">${JSON.stringify(breadcrumb)}<\u002Fscript>`}
	{@html `<script type="application/ld+json">${JSON.stringify(productSchema)}<\u002Fscript>`}
</svelte:head>

<ProductSpecPage
	product={data.product}
	brand={data.brand}
	siblingProducts={data.siblingProducts}
	pillarSlug={data.pillarSlug}
	pillarName={data.pillarName}
/>
