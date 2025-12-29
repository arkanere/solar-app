<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';

	export type AlertTitleProps = HTMLAttributes<HTMLHeadingElement> & {
		children: Snippet;
	};
</script>

<script lang="ts">
	let { class: className, children, ...restProps }: AlertTitleProps = $props();
</script>

<h5
	data-slot="alert-title"
	class={cn('mb-1 font-medium leading-none tracking-tight', className)}
	{...restProps}
>
	{@render children()}
</h5>
