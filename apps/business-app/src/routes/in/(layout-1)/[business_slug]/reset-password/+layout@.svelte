<script lang="ts">
	import type { Snippet } from 'svelte';
	import { onMount } from 'svelte';
	import { theme } from '$lib/stores/theme.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import '../../../../app.css';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();

	onMount(() => {
		theme.initialize();
	});
</script>

<!-- Reset parent layout - no sidebar for password reset -->
<Toaster richColors position="top-right" />
<div class="reset-password-layout">
	{@render children()}
</div>

<style>
	.reset-password-layout {
		margin: 0;
		padding: 0;
		min-height: 100vh;
	}
</style>
