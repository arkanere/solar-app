<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';

	export type TableRowProps = HTMLAttributes<HTMLTableRowElement> & {
		children: Snippet;
	};
</script>

<script lang="ts">
	let { children, class: className, ...restProps }: TableRowProps = $props();
</script>

<tr
	data-slot="table-row"
	class={cn('hover:bg-background-secondary transition-colors', className)}
	{...restProps}
>
	{@render children()}
</tr>
