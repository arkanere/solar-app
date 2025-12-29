<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLTdAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';

	export type TableCellProps = HTMLTdAttributes<HTMLTableCellElement> & {
		children: Snippet;
	};
</script>

<script lang="ts">
	let { children, class: className, ...restProps }: TableCellProps = $props();
</script>

<td
	data-slot="table-cell"
	class={cn('p-4 border-b border-border', className)}
	{...restProps}
>
	{@render children()}
</td>
