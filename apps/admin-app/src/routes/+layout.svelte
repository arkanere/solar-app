<script>
  import Breadcrumb from '$lib/components/Breadcrumb.svelte';
  import { page } from '$app/stores';

  // SvelteKit automatically provides these props to layouts
  export const data = undefined;
  export const params = {};

  // Hide breadcrumb on login page and home page
  $: showBreadcrumb = $page.url.pathname !== '/login' && $page.url.pathname !== '/';
  // Hide breadcrumb on /in/* and /us/* pages (they have their own layout)
  $: isRegionPage = $page.url.pathname.startsWith('/in') || $page.url.pathname.startsWith('/us');
</script>

{#if showBreadcrumb && !isRegionPage}
  <Breadcrumb />
{/if}

<slot />
