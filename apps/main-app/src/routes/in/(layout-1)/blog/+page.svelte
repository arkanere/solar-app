<script lang="ts">
	import Breadcrumb from '$lib/in/components/seo/Breadcrumb.svelte';
	import BlogPostCard from '$lib/in/components/seo/BlogPostCard.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Solar Energy Blog - Expert Guides & Tips | Solar Vipani</title>
	<meta name="description" content="Read expert guides on solar panels, installation, subsidies, and savings. Stay informed with the latest solar energy insights from Solar Vipani." />
	<link rel="canonical" href="https://solarvipani.com/in/blog/" />
</svelte:head>

<div class="max-w-6xl mx-auto px-4 py-8">
	<Breadcrumb items={[
		{ name: 'Home', href: '/in/' },
		{ name: 'Blog', href: '' }
	]} />

	<h1 class="text-3xl md:text-4xl font-bold text-primary mb-4">Solar Energy Blog</h1>
	<p class="text-muted-foreground mb-8">Expert guides, tips, and insights on solar energy in India.</p>

	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
		{#each data.posts as post}
			<BlogPostCard
				title={post.title}
				slug={post.slug}
				excerpt={post.excerpt}
				authorName={post.author_name}
				authorSlug={post.author_slug}
				publishedAt={post.published_at}
				image={post.featured_image}
			/>
		{/each}
	</div>

	{#if data.pagination.totalPages > 1}
		<nav class="flex justify-center gap-4 mt-8" aria-label="Pagination">
			{#if data.pagination.page > 1}
				<a
					href="/in/blog/?page={data.pagination.page - 1}"
					class="px-4 py-2 border rounded-lg hover:border-primary transition-colors"
				>
					Previous
				</a>
			{/if}
			<span class="px-4 py-2 text-muted-foreground">
				Page {data.pagination.page} of {data.pagination.totalPages}
			</span>
			{#if data.pagination.page < data.pagination.totalPages}
				<a
					href="/in/blog/?page={data.pagination.page + 1}"
					class="px-4 py-2 border rounded-lg hover:border-primary transition-colors"
				>
					Next
				</a>
			{/if}
		</nav>
	{/if}
</div>
