<script lang="ts" module>
	import type { HTMLOListAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	export type BreadcrumbListProps = HTMLOListAttributes & {
		children: Snippet;
		ref?: HTMLOListElement | null;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: BreadcrumbListProps = $props();
</script>

<ol
	bind:this={ref}
	data-slot="breadcrumb-list"
	class={cn(
		'flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</ol>
