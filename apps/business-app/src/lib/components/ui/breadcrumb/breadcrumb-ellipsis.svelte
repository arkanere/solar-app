<script lang="ts" module>
	import type { HTMLSpanAttributes } from 'svelte/elements';

	export type BreadcrumbEllipsisProps = HTMLSpanAttributes & {
		ref?: HTMLSpanElement | null;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { MoreHorizontal } from '@lucide/svelte';

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: BreadcrumbEllipsisProps = $props();
</script>

<span
	bind:this={ref}
	data-slot="breadcrumb-ellipsis"
	role="presentation"
	aria-hidden="true"
	class={cn('flex size-9 items-center justify-center', className)}
	{...restProps}
>
	<MoreHorizontal class="size-4" />
	<span class="sr-only">More</span>
</span>
