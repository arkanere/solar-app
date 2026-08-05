<script lang="ts">
	import type { Snippet } from 'svelte';
	import SponsorRibbon from '$lib/in/SponsorRibbon.svelte';

	export type LayoutProps = {
		children: Snippet;
	};

	let { children }: LayoutProps = $props();
</script>

<SponsorRibbon />
<!-- Reserve space for the fixed ribbon once, here. No descendant should offset
     itself by --ribbon-height again. -->
<div style="padding-top: var(--ribbon-height)">
	{@render children()}
</div>
