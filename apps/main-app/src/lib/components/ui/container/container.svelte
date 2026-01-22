<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		class?: string;
		children?: Snippet;
	}

	let { class: className, children, ...rest }: Props = $props();
</script>

<div
	class="border border-inner-glow bg-card shadow-xs gradient-subtle backdrop-glass {className}"
	style="border-radius: var(--container-radius); padding: var(--container-padding); transition: var(--container-transition);"
	{...rest}
>
	{#if children}
		{@render children()}
	{/if}
</div>
