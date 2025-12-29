<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLThAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';

	export type TableHeaderProps = HTMLThAttributes<HTMLTableCellElement> & {
		children: Snippet;
	};
</script>

<script lang="ts">
	let { children, class: className, ...restProps }: TableHeaderProps = $props();
</script>

<th
	data-slot="table-header"
	class={cn('p-4 text-left font-semibold border-b-2 border-border whitespace-nowrap', className)}
	{...restProps}
>
	{@render children()}
</th>
