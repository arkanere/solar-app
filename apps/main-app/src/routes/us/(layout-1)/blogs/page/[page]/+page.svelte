<script>
	import { isDarkMode } from '$lib/us/themeStore';

	let { data } = $props();

	let darkMode = $derived($isDarkMode);
	const derivedData = $derived(data);
	let { blogs, error, pagination } = derivedData;

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
</script>

<svelte:head>
	<title>Solar Vipani Blog - Solar Energy Guides & Resources</title>
	<meta
		name="description"
		content="Explore comprehensive guides on solar panel systems, financing options, and installation tips. Learn about solar systems, zero-cost EMI schemes, and more."
	/>
	<meta name="robots" content="index, follow" />
	<link rel="canonical" href="https://solarvipani.com/us/blogs" />
</svelte:head>

<main class={darkMode ? 'dark' : 'light'}>
	<div class="blogs-list">
		<h1>Blog Posts</h1>

		{#if error}
			<div class="error-message">
				<p>⚠️ {error}</p>
			</div>
		{:else if blogs.length === 0}
			<div class="no-blogs">
				<p>No blog posts available yet. Check back soon!</p>
			</div>
		{:else}
			<ul>
				{#each blogs as blog}
					<li class="blog-item">
						<a href="/us/blogs/{blog.slug}">
							{#if getFeaturedImageUrl(blog.featured_image)}
								<div class="blog-image">
									<img
										src={getFeaturedImageUrl(blog.featured_image)}
										alt={blog.featured_image?.alt || blog.title}
										loading="lazy"
									/>
								</div>
							{/if}
							<div class="blog-content">
								<h2>{blog.title}</h2>
								{#if blog.excerpt}
									<p class="excerpt">{blog.excerpt}</p>
								{/if}
								<div class="blog-meta">
									{#if blog.author_name}
										<span class="author">By {blog.author_name}</span>
									{/if}
									{#if blog.published_at}
										<span class="date">{formatDate(blog.published_at)}</span>
									{/if}
									{#if blog.view_count > 0}
										<span class="views">{blog.view_count} views</span>
									{/if}
								</div>
							</div>
						</a>
					</li>
				{/each}
			</ul>

			{#if pagination && pagination.totalPages > 1}
				<div class="pagination">
					{#if pagination.page > 1}
						<a href="/us/blogs/page/{pagination.page - 1}" class="pagination-btn"> ← Previous </a>
					{/if}

					<div class="pagination-numbers">
						{#each Array(pagination.totalPages) as _, i}
							{#if i + 1 === pagination.page}
								<span class="page-number active">{i + 1}</span>
							{:else if Math.abs(i + 1 - pagination.page) <= 2 || i === 0 || i === pagination.totalPages - 1}
								<a href="/us/blogs/page/{i + 1}" class="page-number">
									{i + 1}
								</a>
							{:else if Math.abs(i + 1 - pagination.page) === 3}
								<span class="page-ellipsis">...</span>
							{/if}
						{/each}
					</div>

					{#if pagination.page < pagination.totalPages}
						<a href="/us/blogs/page/{pagination.page + 1}" class="pagination-btn"> Next → </a>
					{/if}
				</div>
			{/if}
		{/if}
	</div>
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
		justify-content: center;
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

	.blogs-list {
		max-width: 800px;
		width: 100%;
	}

	.blogs-list h1 {
		text-align: center;
		font-size: 2.2rem;
		margin-bottom: 1.5rem;
		font-weight: 600;
		line-height: 1.3;
	}

	.error-message,
	.no-blogs {
		text-align: center;
		padding: 2rem;
		font-size: 1.1rem;
	}

	ul {
		list-style: none;
		padding: 0;
	}

	.blog-item {
		margin-bottom: 2rem;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		border-radius: 8px;
		transition: box-shadow 0.3s ease;
		overflow: hidden;
	}

	.blog-item a {
		text-decoration: none;
		color: inherit;
		display: block;
	}

	.blog-item:hover {
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
	}

	.blog-image {
		width: 100%;
		height: 250px;
		overflow: hidden;
	}

	.blog-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.blog-content {
		padding: 1.5rem;
	}

	.blog-item h2 {
		font-size: 1.8rem;
		font-weight: 600;
		margin-bottom: 0.75rem;
	}

	.excerpt {
		font-size: 1.1rem;
		line-height: 1.6;
		margin-bottom: 1rem;
		color: inherit;
		opacity: 0.9;
	}

	.blog-meta {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
		font-size: 0.9rem;
		opacity: 0.7;
	}

	.blog-meta span {
		display: inline-block;
	}

	/* Pagination styles */
	.pagination {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1rem;
		margin-top: 3rem;
		padding: 2rem 0;
	}

	.pagination-btn {
		padding: 0.75rem 1.5rem;
		background-color: var(--accent-color);
		color: white;
		text-decoration: none;
		border-radius: 8px;
		font-weight: 600;
		transition: background-color 0.3s ease;
	}

	.pagination-btn:hover {
		background-color: #004494;
	}

	.pagination-numbers {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}

	.page-number {
		padding: 0.5rem 0.75rem;
		text-decoration: none;
		color: inherit;
		border-radius: 6px;
		transition: background-color 0.3s ease;
		min-width: 40px;
		text-align: center;
	}

	.page-number:hover {
		background-color: rgba(0, 86, 179, 0.1);
	}

	.page-number.active {
		background-color: var(--accent-color);
		color: white;
		font-weight: 600;
	}

	.page-ellipsis {
		padding: 0.5rem;
		color: inherit;
		opacity: 0.6;
	}

	@media (max-width: 768px) {
		main {
			padding: 1.5rem;
		}

		.blog-item h2 {
			font-size: 1.5rem;
		}

		.excerpt {
			font-size: 1rem;
		}

		.blog-image {
			height: 200px;
		}

		.pagination {
			flex-wrap: wrap;
			gap: 0.5rem;
		}

		.pagination-btn {
			padding: 0.5rem 1rem;
			font-size: 0.9rem;
		}

		.pagination-numbers {
			gap: 0.25rem;
		}

		.page-number {
			padding: 0.4rem 0.6rem;
			min-width: 35px;
			font-size: 0.9rem;
		}
	}
</style>
