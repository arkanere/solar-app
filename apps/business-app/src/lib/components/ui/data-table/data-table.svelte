<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLTableAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';

	export type DataTableProps = HTMLTableAttributes<HTMLTableElement> & {
		headers: Snippet;
		children: Snippet;
	};
</script>

<script lang="ts">
	let { headers, children, class: className, ...restProps }: DataTableProps = $props();
</script>

<div
	data-slot="data-table"
	class="bg-card rounded-lg border border-border shadow-card overflow-x-auto"
>
	<table class={cn('w-full border-collapse', className)} {...restProps}>
		<thead class="bg-background-secondary">
			<tr>
				{@render headers()}
			</tr>
		</thead>
		<tbody>
			{@render children()}
		</tbody>
	</table>
</div>
