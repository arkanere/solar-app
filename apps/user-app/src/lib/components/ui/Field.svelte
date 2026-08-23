<script lang="ts">
	import type { Snippet } from 'svelte';

	// One label/value pair. Label above value, per the stacked card variant in
	// business-app (branch/+page.svelte).
	let {
		label,
		value = undefined,
		class: className = '',
		children = undefined
	}: { label: string; value?: string | null; class?: string; children?: Snippet } = $props();
</script>

<div class={className}>
	<p class="text-sm text-muted-foreground">{label}</p>
	{#if children}
		<div class="mt-0.5 text-sm font-medium text-foreground">{@render children()}</div>
	{:else}
		<p class="mt-0.5 text-sm font-medium text-foreground">{value}</p>
	{/if}
</div>
