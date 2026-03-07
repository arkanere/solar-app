<script lang="ts">
	import Breadcrumb from '$lib/in/components/seo/Breadcrumb.svelte';
	import AuthorByline from '$lib/in/components/seo/AuthorByline.svelte';
	import RelatedPosts from '$lib/in/components/seo/RelatedPosts.svelte';
	import { articleLD, breadcrumbLD } from '$lib/seo';

	let { data } = $props();

	const jsonLdArticle = $derived(JSON.stringify(articleLD({
		title: data.post.title,
		slug: data.post.slug,
		description: data.post.meta_description || data.post.excerpt || '',
		datePublished: data.post.published_at,
		dateModified: data.post.updated_at || data.post.published_at,
		author: data.post.author_name || 'Solar Vipani',
		image: data.post.featured_image
	})));

	const jsonLdBreadcrumb = $derived(JSON.stringify(breadcrumbLD([
		{ name: 'Home', url: 'https://solarvipani.com/in/' },
		{ name: 'Blog', url: 'https://solarvipani.com/in/blog/' },
		{ name: data.post.title, url: `https://solarvipani.com/in/blog/${data.post.slug}/` }
	])));
</script>

<svelte:head>
	<title>{data.post.meta_title || data.post.title} | Solar Vipani</title>
	<meta name="description" content={data.post.meta_description || data.post.excerpt || ''} />
	<link rel="canonical" href="https://solarvipani.com/in/blog/{data.post.slug}/" />
	<meta property="og:title" content={data.post.meta_title || data.post.title} />
	<meta property="og:description" content={data.post.meta_description || data.post.excerpt || ''} />
	<meta property="og:type" content="article" />
	<meta property="og:url" content="https://solarvipani.com/in/blog/{data.post.slug}/" />
	{#if data.post.featured_image}
		<meta property="og:image" content={data.post.featured_image} />
	{/if}
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={data.post.meta_title || data.post.title} />
	<meta name="twitter:description" content={data.post.meta_description || data.post.excerpt || ''} />
	{@html `<script type="application/ld+json">${jsonLdArticle}</script>`}
	{@html `<script type="application/ld+json">${jsonLdBreadcrumb}</script>`}
</svelte:head>

<article class="max-w-4xl mx-auto px-4 py-8">
	<Breadcrumb items={[
		{ name: 'Home', href: '/in/' },
		{ name: 'Blog', href: '/in/blog/' },
		{ name: data.post.title, href: '' }
	]} />

	<h1 class="text-3xl md:text-4xl font-bold text-primary mb-4">{data.post.title}</h1>

	<div class="mb-8">
		<AuthorByline
			name={data.post.author_name || 'Solar Vipani'}
			slug={data.post.author_slug || ''}
			photo={data.post.author_photo}
			date={data.post.published_at}
		/>
	</div>

	{#if data.post.featured_image}
		<img
			src={data.post.featured_image}
			alt={data.post.title}
			class="w-full rounded-lg mb-8"
		/>
	{/if}

	<div class="prose prose-sm max-w-none">
		{@html data.post.content}
	</div>

	{#if data.parentCluster}
		<div class="mt-8 p-4 bg-muted rounded-lg">
			<p class="text-sm text-muted-foreground">
				Read the full guide:
				<a
					href="/in/{data.parentCluster.pillar_slug}/{data.parentCluster.slug}/"
					class="font-medium text-primary hover:underline"
				>
					{data.parentCluster.h1}
				</a>
			</p>
		</div>
	{/if}

	<RelatedPosts posts={data.relatedPosts.map((p: { title: string; slug: string; published_at: string }) => ({
		title: p.title,
		slug: p.slug,
		publishedAt: p.published_at
	}))} />

	<div class="text-center mt-12 mb-8">
		<p class="text-muted-foreground mb-4">Getting ready for solar? Get quotes from verified installers.</p>
		<a
			href="/in/get-quotes/"
			class="inline-block bg-primary text-primary-foreground font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity"
		>
			Get Free Solar Quotes
		</a>
	</div>
</article>
