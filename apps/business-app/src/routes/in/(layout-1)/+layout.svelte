<script lang="ts">
	import type { Snippet } from 'svelte';
	import SponsorRibbon from '$lib/in/SponsorRibbon.svelte';

	export type LayoutProps = {
		children: Snippet;
	};

	let { children }: LayoutProps = $props();
</script>

<SponsorRibbon />
{@render children()}
