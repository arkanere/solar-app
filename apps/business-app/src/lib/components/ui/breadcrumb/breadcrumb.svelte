<script lang="ts" module>
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	export type BreadcrumbProps = HTMLAttributes<HTMLElement> & {
		children: Snippet;
		ref?: HTMLElement | null;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: BreadcrumbProps = $props();
</script>

<nav
	bind:this={ref}
	data-slot="breadcrumb"
	aria-label="Breadcrumb"
	class={cn('', className)}
	{...restProps}
>
	{@render children?.()}
</nav>
