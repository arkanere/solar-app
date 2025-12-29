<script lang="ts" module>
	import type { HTMLLiAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	export type BreadcrumbSeparatorProps = Omit<HTMLLiAttributes, 'children'> & {
		children?: Snippet;
		ref?: HTMLLIElement | null;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { ChevronRight } from '@lucide/svelte';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: BreadcrumbSeparatorProps = $props();
</script>

<li
	bind:this={ref}
	data-slot="breadcrumb-separator"
	role="presentation"
	aria-hidden="true"
	class={cn('[&>svg]:size-3.5', className)}
	{...restProps}
>
	{#if children}
		{@render children()}
	{:else}
		<ChevronRight />
	{/if}
</li>
