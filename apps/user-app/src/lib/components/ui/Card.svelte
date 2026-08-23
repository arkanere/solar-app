<script lang="ts">
	import type { Snippet } from 'svelte';

	// Flat, bordered surface. Elevation comes from the 1px border, not the shadow —
	// --shadow-card is `none` in light mode and only lifts in dark.
	let {
		class: className = '',
		children
	}: { class?: string; children: Snippet } = $props();
</script>

<div
	class="rounded-lg border border-border bg-card text-card-foreground shadow-card transition-shadow duration-200 {className}"
>
	{@render children()}
</div>
