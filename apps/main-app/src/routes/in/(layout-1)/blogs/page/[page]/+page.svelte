<script>
  import { Button } from '$lib/components/ui/button';

  let { data } = $props();

  let { blogs, error, pagination } = $derived(data);

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
  <link rel="canonical" href="https://solarvipani.com/in/blogs" />
</svelte:head>

<main class="w-full min-h-screen bg-background text-foreground transition-colors duration-100 dark:bg-background dark:text-foreground flex flex-col items-center justify-center py-[theme(--card-padding-y)] px-[theme(--container-padding)] md:py-[theme(--spacing-4xl)]">
  <div class="max-w-3xl w-full">
    <h1 class="text-center text-2xl md:text-4xl font-semibold mb-[theme(--card-padding-y)] leading-tight">Blog Posts</h1>

    {#if error}
      <div class="text-center p-[theme(--card-padding-y)] text-sm md:text-lg">
        <p>⚠️ {error}</p>
      </div>
    {:else if blogs.length === 0}
      <div class="text-center p-[theme(--card-padding-y)] text-sm md:text-lg">
        <p>No blog posts available yet. Check back soon!</p>
      </div>
    {:else}
      <ul class="space-y-[theme(--card-gap)]">
        {#each blogs as blog}
          <li class="rounded-[theme(--radius-lg)] shadow-card hover:shadow-card transition-shadow overflow-hidden bg-background-secondary">
            <a href="/in/blogs/{blog.slug}" class="no-underline text-foreground dark:text-foreground block hover:no-underline">
              {#if getFeaturedImageUrl(blog.featured_image)}
                <div class="w-full h-[theme(--height-xs)] md:h-[theme(--height-sm)] overflow-hidden">
                  <img
                    src={getFeaturedImageUrl(blog.featured_image)}
                    alt={blog.featured_image?.alt || blog.title}
                    loading="lazy"
                    class="w-full h-full object-cover"
                  />
                </div>
              {/if}
              <div class="p-[theme(--container-padding)]">
                <h2 class="text-2xl md:text-2xl font-semibold mb-[theme(--spacing-lg)]">{blog.title}</h2>
                {#if blog.excerpt}
                  <p class="text-sm md:text-lg leading-relaxed mb-[theme(--spacing-lg)] opacity-90">{blog.excerpt}</p>
                {/if}
                <div class="flex gap-[theme(--spacing-lg)] flex-wrap text-sm opacity-70">
                  {#if blog.author_name}
                    <span class="inline-block">By {blog.author_name}</span>
                  {/if}
                  {#if blog.published_at}
                    <span class="inline-block">{formatDate(blog.published_at)}</span>
                  {/if}
                  {#if blog.view_count > 0}
                    <span class="inline-block">{blog.view_count} views</span>
                  {/if}
                </div>
              </div>
            </a>
          </li>
        {/each}
      </ul>

      {#if pagination && pagination.totalPages > 1}
        <div class="flex justify-center items-center gap-[theme(--spacing-lg)] md:gap-[theme(--spacing-lg)] mt-[theme(--spacing-4xl)] pt-[theme(--spacing-2xl)] flex-wrap">
          {#if pagination.page > 1}
            <Button asChild>
              <a href="/in/blogs/page/{pagination.page - 1}">← Previous</a>
            </Button>
          {/if}

          <div class="flex gap-[theme(--spacing-lg)] items-center">
            {#each Array(pagination.totalPages) as _, i}
              {#if i + 1 === pagination.page}
                <span class="px-[theme(--spacing-lg)] md:px-[theme(--spacing-lg)] py-[theme(--spacing-lg)] md:py-[theme(--spacing-lg)] bg-primary text-primary-foreground rounded-[theme(--radius-sm)] font-semibold text-sm md:text-sm w-8 md:w-10 text-center">{i + 1}</span>
              {:else if Math.abs(i + 1 - pagination.page) <= 2 || i === 0 || i === pagination.totalPages - 1}
                <Button variant="outline" asChild>
                  <a href="/in/blogs/page/{i + 1}">{i + 1}</a>
                </Button>
              {:else if Math.abs(i + 1 - pagination.page) === 3}
                <span class="px-[theme(--spacing-lg)] text-foreground dark:text-foreground opacity-60">...</span>
              {/if}
            {/each}
          </div>

          {#if pagination.page < pagination.totalPages}
            <Button asChild>
              <a href="/in/blogs/page/{pagination.page + 1}">Next →</a>
            </Button>
          {/if}
        </div>
      {/if}
    {/if}
  </div>
</main>

