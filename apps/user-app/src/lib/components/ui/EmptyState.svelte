<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		title,
		class: className = '',
		children = undefined
	}: { title: string; class?: string; children?: Snippet } = $props();
</script>

<div class="rounded-lg border-2 border-dashed border-border px-6 py-12 text-center {className}">
	<p class="text-base font-semibold text-muted-foreground">{title}</p>
	{#if children}
		<p class="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{@render children()}</p>
	{/if}
</div>
