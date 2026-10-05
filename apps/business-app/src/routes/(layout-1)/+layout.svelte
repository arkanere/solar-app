<script lang="ts">
	import type { Snippet } from 'svelte';

	export type LayoutProps = {
		children: Snippet;
	};

	let { children }: LayoutProps = $props();
</script>

{@render children()}
