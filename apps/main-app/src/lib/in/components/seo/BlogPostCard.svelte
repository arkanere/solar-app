<script lang="ts">
	import AuthorByline from './AuthorByline.svelte';

	let { title, slug, excerpt, authorName, authorSlug, publishedAt, image }: {
		title: string;
		slug: string;
		excerpt: string;
		authorName: string;
		authorSlug: string;
		publishedAt: string;
		image?: string;
	} = $props();
</script>

<article class="border rounded-lg hover:border-primary hover:shadow-sm transition-all overflow-hidden">
	{#if image}
		<a href="/in/blog/{slug}/">
			<img src={image} alt={title} class="w-full h-48 object-cover" />
		</a>
	{/if}
	<div class="p-4">
		<a href="/in/blog/{slug}/">
			<h2 class="font-semibold text-foreground hover:text-primary mb-2 line-clamp-2">{title}</h2>
		</a>
		<p class="text-sm text-muted-foreground mb-3 line-clamp-3">{excerpt}</p>
		<AuthorByline name={authorName} slug={authorSlug} date={publishedAt} />
	</div>
</article>
