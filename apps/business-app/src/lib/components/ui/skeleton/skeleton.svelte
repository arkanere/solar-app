<script lang="ts" module>
	import type { HTMLAttributes } from 'svelte/elements';
	import type { WithElementRef } from '$lib/utils';

	export type SkeletonProps = WithElementRef<HTMLDivElement> & HTMLAttributes<HTMLDivElement>;
</script>

<script lang="ts">
	import { cn } from '$lib/utils';

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: SkeletonProps = $props();
</script>

<div
	bind:this={ref}
	data-slot="skeleton"
	class={cn('animate-pulse rounded-md bg-muted', className)}
	{...restProps}
/>
