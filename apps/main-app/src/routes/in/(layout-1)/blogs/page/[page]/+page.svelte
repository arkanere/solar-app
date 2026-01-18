<script>
  import { isDarkMode } from "$lib/themeStore.svelte";

  let { data } = $props();

  let darkMode = $derived($isDarkMode);
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

<main class="w-full min-h-screen bg-background text-foreground transition-colors duration-300 dark:bg-background dark:text-foreground flex flex-col items-center justify-center py-8 px-4 md:py-12">
  <div class="max-w-3xl w-full">
    <h1 class="text-center text-3xl md:text-4xl font-semibold mb-8 leading-tight">Blog Posts</h1>

    {#if error}
      <div class="text-center p-8 text-base md:text-lg">
        <p>⚠️ {error}</p>
      </div>
    {:else if blogs.length === 0}
      <div class="text-center p-8 text-base md:text-lg">
        <p>No blog posts available yet. Check back soon!</p>
      </div>
    {:else}
      <ul class="space-y-6">
        {#each blogs as blog}
          <li class="rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-border">
            <a href="/in/blogs/{blog.slug}" class="no-underline text-foreground dark:text-foreground block hover:no-underline">
              {#if getFeaturedImageUrl(blog.featured_image)}
                <div class="w-full h-48 md:h-64 overflow-hidden">
                  <img
                    src={getFeaturedImageUrl(blog.featured_image)}
                    alt={blog.featured_image?.alt || blog.title}
                    loading="lazy"
                    class="w-full h-full object-cover"
                  />
                </div>
              {/if}
              <div class="p-6">
                <h2 class="text-2xl md:text-3xl font-semibold mb-3">{blog.title}</h2>
                {#if blog.excerpt}
                  <p class="text-base md:text-lg leading-relaxed mb-4 opacity-90">{blog.excerpt}</p>
                {/if}
                <div class="flex gap-4 flex-wrap text-sm opacity-70">
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
        <div class="flex justify-center items-center gap-2 md:gap-4 mt-12 pt-8 flex-wrap">
          {#if pagination.page > 1}
            <a href="/in/blogs/page/{pagination.page - 1}" class="px-4 md:px-6 py-2 md:py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary-hover transition-colors text-sm md:text-base">
              ← Previous
            </a>
          {/if}

          <div class="flex gap-1 items-center">
            {#each Array(pagination.totalPages) as _, i}
              {#if i + 1 === pagination.page}
                <span class="px-2 md:px-3 py-1 md:py-2 bg-primary text-primary-foreground rounded font-semibold text-sm md:text-base w-8 md:w-10 text-center">{i + 1}</span>
              {:else if Math.abs(i + 1 - pagination.page) <= 2 || i === 0 || i === pagination.totalPages - 1}
                <a href="/in/blogs/page/{i + 1}" class="px-2 md:px-3 py-1 md:py-2 rounded text-foreground dark:text-foreground hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-sm md:text-base w-8 md:w-10 text-center">
                  {i + 1}
                </a>
              {:else if Math.abs(i + 1 - pagination.page) === 3}
                <span class="px-1 text-foreground dark:text-foreground opacity-60">...</span>
              {/if}
            {/each}
          </div>

          {#if pagination.page < pagination.totalPages}
            <a href="/in/blogs/page/{pagination.page + 1}" class="px-4 md:px-6 py-2 md:py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary-hover transition-colors text-sm md:text-base">
              Next →
            </a>
          {/if}
        </div>
      {/if}
    {/if}
  </div>
</main>

