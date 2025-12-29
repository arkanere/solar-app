<script lang="ts" module>
	import type { HTMLAnchorAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	export type BreadcrumbLinkProps = HTMLAnchorAttributes & {
		children: Snippet;
		ref?: HTMLAnchorElement | null;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: BreadcrumbLinkProps = $props();
</script>

<a
	bind:this={ref}
	data-slot="breadcrumb-link"
	class={cn(
		'transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</a>
