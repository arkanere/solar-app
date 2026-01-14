<script>
	import { isDarkMode } from '$lib/themeStore';
	import LeadFormBusiness from '$lib/in/LeadFormBusiness.svelte';

	const { data } = $props();

	let darkMode = $derived($isDarkMode);
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

<main class={darkMode ? 'dark' : 'light'}>
	<div class="blogpost">
		<header class="blog-header">
			<h1>{blog.title}</h1>
			{#if blog.author_name}
				<p>By <a href="/about-us">{blog.author_name}</a></p>
			{/if}
			{#if blog.published_at}
				<p>
					Published: <time datetime={blog.published_at}>{formatDate(blog.published_at)}</time>
				</p>
			{/if}
			{#if blog.updated_at && blog.updated_at !== blog.published_at}
				<p class="last-updated">
					Last updated: <time datetime={blog.updated_at}>{formatDate(blog.updated_at)}</time>
				</p>
			{/if}
		</header>

		{#if getFeaturedImageUrl(blog.featured_image)}
			<div class="featured-image">
				<img
					src={getFeaturedImageUrl(blog.featured_image)}
					alt={getFeaturedImageAlt(blog.featured_image)}
				/>
			</div>
		{/if}

		{#if blog.tags && blog.tags.length > 0}
			<div class="tags">
				{#each blog.tags as tag}
					<span class="tag">{tag}</span>
				{/each}
			</div>
		{/if}

		<div class="blog-content">
			{@html blog.content}
		</div>

		{#if blog.categories && blog.categories.length > 0}
			<div class="categories">
				<strong>Categories:</strong>
				{#each blog.categories as category, index}
					<span>{category}{index < blog.categories.length - 1 ? ', ' : ''}</span>
				{/each}
			</div>
		{/if}
	</div>

	<section id="lead-form-sv" class="lead-form-section">
		<h2>Get Your Free Solar Quote Today</h2>
		<p class="lead-form-subtitle">
			Connect with verified solar installers in your area and receive personalized quotes.
			Free consultation and competitive pricing guaranteed.
		</p>
		<LeadFormBusiness />
	</section>
</main>

<style>
	:root {
		--light-bg-color: #f8f9fa;
		--dark-bg-color: #1a1a1a;
		--light-primary-text-color: #333;
		--dark-primary-text-color: #f0f0f0;
		--accent-color: #0056b3;
		--font-family: 'Helvetica Neue', Arial, sans-serif;
	}

	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 2rem;
		font-family: var(--font-family);
		transition:
			background-color 0.3s ease,
			color 0.3s ease;
		min-height: 100vh;
	}

	.light {
		background-color: var(--light-bg-color);
		color: var(--light-primary-text-color);
	}

	.dark {
		background-color: var(--dark-bg-color);
		color: var(--dark-primary-text-color);
	}

	.blogpost {
		max-width: 800px;
		width: 100%;
		margin-bottom: 3rem;
	}

	.blog-header {
		margin-bottom: 2rem;
		padding-bottom: 1.5rem;
		border-bottom: 2px solid rgba(0, 0, 0, 0.1);
	}

	.dark .blog-header {
		border-bottom-color: rgba(255, 255, 255, 0.1);
	}

	.blog-header h1 {
		font-size: 2.5rem;
		font-weight: 700;
		line-height: 1.3;
		margin-bottom: 1rem;
	}

	.blog-header p {
		font-size: 1rem;
		margin: 0.5rem 0;
		opacity: 0.8;
	}

	.blog-header a {
		color: var(--accent-color);
		text-decoration: none;
	}

	.blog-header a:hover {
		text-decoration: underline;
	}

	.last-updated {
		font-style: italic;
	}

	.featured-image {
		width: 100%;
		margin-bottom: 2rem;
		border-radius: 8px;
		overflow: hidden;
	}

	.featured-image img {
		width: 100%;
		height: auto;
		display: block;
	}

	.tags {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
		margin-bottom: 2rem;
	}

	.tag {
		display: inline-block;
		padding: 0.3rem 0.8rem;
		background-color: var(--accent-color);
		color: white;
		border-radius: 20px;
		font-size: 0.85rem;
		font-weight: 500;
	}

	.blog-content {
		font-size: 1.1rem;
		line-height: 1.8;
		margin-bottom: 2rem;
	}

	.blog-content :global(h2) {
		font-size: 2rem;
		font-weight: 600;
		margin-top: 2.5rem;
		margin-bottom: 1rem;
		line-height: 1.3;
		color: var(--accent-color);
	}

	.blog-content :global(h3) {
		font-size: 1.6rem;
		font-weight: 600;
		margin-top: 2rem;
		margin-bottom: 0.8rem;
		line-height: 1.3;
	}

	.blog-content :global(h4) {
		font-size: 1.3rem;
		font-weight: 600;
		margin-top: 1.5rem;
		margin-bottom: 0.6rem;
	}

	.blog-content :global(p) {
		margin-bottom: 1.2rem;
	}

	.blog-content :global(ul),
	.blog-content :global(ol) {
		margin-bottom: 1.2rem;
		padding-left: 2rem;
	}

	.blog-content :global(li) {
		margin-bottom: 0.5rem;
	}

	.blog-content :global(a) {
		color: var(--accent-color);
		text-decoration: none;
	}

	.blog-content :global(a:hover) {
		text-decoration: underline;
	}

	.blog-content :global(img) {
		max-width: 100%;
		height: auto;
		border-radius: 8px;
		margin: 1.5rem 0;
	}

	.blog-content :global(blockquote) {
		border-left: 4px solid var(--accent-color);
		padding-left: 1.5rem;
		margin: 1.5rem 0;
		font-style: italic;
		opacity: 0.9;
	}

	.blog-content :global(code) {
		background-color: rgba(0, 0, 0, 0.05);
		padding: 0.2rem 0.4rem;
		border-radius: 4px;
		font-family: 'Courier New', monospace;
		font-size: 0.95em;
	}

	.dark .blog-content :global(code) {
		background-color: rgba(255, 255, 255, 0.1);
	}

	.blog-content :global(pre) {
		background-color: rgba(0, 0, 0, 0.05);
		padding: 1rem;
		border-radius: 8px;
		overflow-x: auto;
		margin: 1.5rem 0;
	}

	.dark .blog-content :global(pre) {
		background-color: rgba(255, 255, 255, 0.1);
	}

	.blog-content :global(pre code) {
		background-color: transparent;
		padding: 0;
	}

	.categories {
		font-size: 1rem;
		margin-top: 2rem;
		padding-top: 1rem;
		border-top: 1px solid rgba(0, 0, 0, 0.1);
		opacity: 0.8;
	}

	.dark .categories {
		border-top-color: rgba(255, 255, 255, 0.1);
	}

	/* Table styling */
	.blog-content :global(table) {
		width: 100%;
		border-collapse: collapse;
		margin: 2rem 0;
		font-size: 1rem;
	}

	.blog-content :global(th),
	.blog-content :global(td) {
		padding: 1rem;
		text-align: left;
		border: 1px solid #ddd;
	}

	.blog-content :global(th) {
		background-color: var(--accent-color);
		color: white;
		font-weight: 600;
	}

	.blog-content :global(tbody tr:nth-child(even)) {
		background-color: rgba(0, 86, 179, 0.1);
	}

	.dark .blog-content :global(th) {
		background-color: var(--accent-color);
	}

	.dark .blog-content :global(td) {
		border-color: #444;
	}

	.dark .blog-content :global(tbody tr:nth-child(even)) {
		background-color: rgba(255, 255, 255, 0.05);
	}

	/* Lead form section styling */
	.lead-form-section {
		margin-top: 3rem;
		padding: 3rem 2rem;
		text-align: center;
		background: linear-gradient(135deg, var(--accent-color), #004494);
		color: white;
		border-radius: 16px;
		max-width: 800px;
		width: 100%;
	}

	.lead-form-section h2 {
		margin: 0 auto 1.5rem;
		font-size: 1.8rem;
		color: white;
		max-width: 800px;
	}

	.lead-form-subtitle {
		color: rgba(255, 255, 255, 0.9);
		font-size: 1.1rem;
		margin-bottom: 1.5rem;
		max-width: 600px;
		margin-left: auto;
		margin-right: auto;
	}

	@media (max-width: 768px) {
		main {
			padding: 1.5rem;
		}

		.blog-header h1 {
			font-size: 2rem;
		}

		.blog-content {
			font-size: 1rem;
		}

		.blog-content :global(h2) {
			font-size: 1.6rem;
		}

		.blog-content :global(h3) {
			font-size: 1.3rem;
		}

		.blog-content :global(table) {
			font-size: 0.9rem;
		}

		.blog-content :global(th),
		.blog-content :global(td) {
			padding: 0.7rem;
		}

		.lead-form-section {
			padding: 2rem 1rem;
			margin-top: 2rem;
		}

		.lead-form-section h2 {
			font-size: 1.5rem;
		}

		.lead-form-subtitle {
			font-size: 1rem;
		}
	}
</style>
