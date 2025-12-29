<script lang="ts" module>
	import type { HTMLSpanAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	export type BreadcrumbPageProps = HTMLSpanAttributes & {
		children: Snippet;
		ref?: HTMLSpanElement | null;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: BreadcrumbPageProps = $props();
</script>

<span
	bind:this={ref}
	data-slot="breadcrumb-page"
	role="link"
	aria-disabled="true"
	aria-current="page"
	class={cn('font-normal text-foreground', className)}
	{...restProps}
>
	{@render children?.()}
</span>
