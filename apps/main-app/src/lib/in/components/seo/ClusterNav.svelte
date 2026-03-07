<script lang="ts">
	let { clusters, currentSlug, pillarSlug }: {
		clusters: { slug: string; name: string }[];
		currentSlug?: string;
		pillarSlug: string;
	} = $props();
</script>

{#if clusters.length > 0}
	<nav class="mb-8">
		<h3 class="text-lg font-semibold text-primary mb-3">Related Topics</h3>
		<div class="flex flex-wrap gap-2">
			{#each clusters as cluster}
				{#if cluster.slug !== currentSlug}
					<a
						href="/in/{pillarSlug}/{cluster.slug}/"
						class="text-sm bg-muted rounded-lg px-3 py-1.5 hover:bg-accent hover:text-accent-foreground transition-colors"
					>
						{cluster.name}
					</a>
				{:else}
					<span class="text-sm bg-primary text-primary-foreground rounded-lg px-3 py-1.5">
						{cluster.name}
					</span>
				{/if}
			{/each}
		</div>
	</nav>
{/if}
