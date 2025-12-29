<script lang="ts" module>
	import type { HTMLLiAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	export type BreadcrumbItemProps = HTMLLiAttributes & {
		children: Snippet;
		ref?: HTMLLIElement | null;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: BreadcrumbItemProps = $props();
</script>

<li
	bind:this={ref}
	data-slot="breadcrumb-item"
	class={cn('inline-flex items-center gap-1.5', className)}
	{...restProps}
>
	{@render children?.()}
</li>
