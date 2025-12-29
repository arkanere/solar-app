<script lang="ts" module>
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	export type ComboboxEmptyProps = HTMLAttributes<HTMLDivElement> & {
		children?: Snippet;
		ref?: HTMLDivElement | null;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: ComboboxEmptyProps = $props();
</script>

<div
	bind:this={ref}
	data-slot="combobox-empty"
	class={cn('py-6 text-center text-sm text-muted-foreground', className)}
	{...restProps}
>
	{#if children}
		{@render children()}
	{:else}
		No results found.
	{/if}
</div>
