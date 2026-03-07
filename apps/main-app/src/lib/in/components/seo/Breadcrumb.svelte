<script lang="ts">
	let { items }: {
		items: { name: string; href: string }[];
	} = $props();
</script>

<nav class="text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
	<ol class="flex flex-wrap gap-1">
		{#each items as item, i}
			{#if i < items.length - 1}
				<li><a href={item.href} class="hover:text-primary">{item.name}</a> /</li>
			{:else}
				<li class="text-foreground font-medium">{item.name}</li>
			{/if}
		{/each}
	</ol>
</nav>
