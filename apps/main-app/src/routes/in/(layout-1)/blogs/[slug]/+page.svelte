<script>
	import LeadForm from '$lib/in-new-rewrites/LeadForm.svelte';
	import { Badge } from '$lib/components/ui/badge';

	const { data } = $props();
	let blog = $derived(data.blog);

	function formatDate(dateString) {
		if (!dateString) return '';
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function getFeaturedImageUrl(featuredImage) {
		if (!featuredImage) return null;
		return typeof featuredImage === 'string' ? featuredImage : featuredImage.url;
	}

	function getFeaturedImageAlt(featuredImage) {
		if (!featuredImage) return '';
		return typeof featuredImage === 'string' ? blog.title : featuredImage.alt || blog.title;
	}

	let articleUrl = $derived(`https://solarvipani.com/in/blogs/${blog.slug}`);

	let jsonLdData = $derived({
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: blog.seo_metadata?.metaTitle || blog.title,
		author: {
			'@type': 'Person',
			name: blog.author_name || 'SolarVipani Admin',
			url: '/about-us'
		},
		datePublished: blog.published_at,
		dateModified: blog.updated_at,
		mainEntityOfPage: {
			'@type': 'WebPage',
			'@id': articleUrl
		},
		publisher: {
			'@type': 'Organization',
			name: 'SolarVipani'
		},
		description: blog.seo_metadata?.metaDescription || blog.excerpt,
		...(getFeaturedImageUrl(blog.featured_image) && {
			image: getFeaturedImageUrl(blog.featured_image)
		})
	});

	let jsonLdString = $derived(JSON.stringify(jsonLdData));

	let metaTitle = $derived(blog.seo_metadata?.metaTitle || blog.title);
	let metaDescription = $derived(blog.seo_metadata?.metaDescription || blog.excerpt);
	let metaKeywords = $derived(blog.seo_metadata?.keywords || blog.tags?.join(', ') || '');
</script>

<svelte:head>
	<title>{metaTitle}</title>
	<meta name="description" content={metaDescription} />
	{#if metaKeywords}
		<meta name="keywords" content={metaKeywords} />
	{/if}
	<meta name="robots" content="index, follow" />
	<link rel="canonical" href={articleUrl} />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="article" />
	<meta property="og:url" content={articleUrl} />
	<meta property="og:title" content={metaTitle} />
	<meta property="og:description" content={metaDescription} />
	{#if getFeaturedImageUrl(blog.featured_image)}
		<meta property="og:image" content={getFeaturedImageUrl(blog.featured_image)} />
	{/if}

	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content={articleUrl} />
	<meta property="twitter:title" content={metaTitle} />
	<meta property="twitter:description" content={metaDescription} />
	{#if getFeaturedImageUrl(blog.featured_image)}
		<meta property="twitter:image" content={getFeaturedImageUrl(blog.featured_image)} />
	{/if}

	{@html `
      <script type="application/ld+json">
        ${jsonLdString}
      <\/script>
    `}
</svelte:head>

<main class="w-full min-h-screen bg-background text-foreground transition-colors duration-300 dark:bg-background dark:text-foreground flex flex-col items-center py-[theme(--spacing-lg)] px-[theme(--container-padding)] md:py-[theme(--spacing-3xl)]">
	<div class="max-w-3xl w-full mb-[theme(--spacing-3xl)]">
		<header class="mb-[theme(--spacing-xl)] pb-[theme(--spacing-md)] border-b border-border">
			<h1 class="text-[theme(--font-size-4xl)] md:text-4xl font-bold mb-[theme(--spacing-md)] leading-tight">{blog.title}</h1>
			{#if blog.author_name}
				<p class="text-[theme(--font-size-base)] mb-[theme(--spacing-xs)]">
					By <a href="/about-us" class="text-primary hover:underline">
						{blog.author_name}
					</a>
				</p>
			{/if}
			{#if blog.published_at}
				<p class="text-[theme(--font-size-base)] opacity-80">
					Published: <time datetime={blog.published_at}>{formatDate(blog.published_at)}</time>
				</p>
			{/if}
			{#if blog.updated_at && blog.updated_at !== blog.published_at}
				<p class="text-[theme(--font-size-base)] opacity-80 italic">
					Last updated: <time datetime={blog.updated_at}>{formatDate(blog.updated_at)}</time>
				</p>
			{/if}
		</header>

		{#if getFeaturedImageUrl(blog.featured_image)}
			<div class="w-full mb-[theme(--spacing-xl)] rounded-[theme(--radius-lg)] overflow-hidden">
				<img
					src={getFeaturedImageUrl(blog.featured_image)}
					alt={getFeaturedImageAlt(blog.featured_image)}
					class="w-full h-auto"
				/>
			</div>
		{/if}

		{#if blog.tags && blog.tags.length > 0}
			<div class="flex gap-[theme(--spacing-sm)] flex-wrap mb-[theme(--spacing-xl)]">
				{#each blog.tags as tag}
					<Badge variant="default">{tag}</Badge>
				{/each}
			</div>
		{/if}

		<div class="prose prose-invert max-w-none mb-[theme(--spacing-xl)] text-[theme(--font-size-lg)] leading-relaxed">
			{@html blog.content}
		</div>

		{#if blog.categories && blog.categories.length > 0}
			<div class="mt-[theme(--spacing-xl)] pt-[theme(--spacing-md)] border-t border-border opacity-80 text-[theme(--font-size-base)]">
				<strong>Categories:</strong>
				{#each blog.categories as category, index}
					<span>{category}{index < blog.categories.length - 1 ? ', ' : ''}</span>
				{/each}
			</div>
		{/if}
	</div>

	<section id="lead-form-sv" class="w-full max-w-[theme(--max-width-md)] mx-auto rounded-[theme(--radius-xl)] bg-gradient-to-r from-primary to-primary text-primary-foreground p-[theme(--spacing-lg)] md:p-[theme(--spacing-3xl)] text-center shadow-[theme(--shadow-lg)]">
		<h2 class="text-[theme(--font-size-3xl)] md:text-4xl font-semibold mb-[theme(--spacing-md)] text-primary-foreground">Get Your Free Solar Quote Today</h2>
		<p class="text-[theme(--font-size-base)] md:text-[theme(--font-size-lg)] mb-[theme(--spacing-xl)] text-primary-foreground/90 mx-auto">
			Connect with verified solar installers in your area and receive personalized quotes.
			Free consultation and competitive pricing guaranteed.
		</p>
		<LeadForm showWrapper={false} />
	</section>
</main>

