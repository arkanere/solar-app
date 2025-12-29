<script lang="ts" module>
	import type { Tabs as TabsPrimitive } from 'bits-ui';

	export type TabsListProps = TabsPrimitive.ListProps;
</script>

<script lang="ts">
	import { Tabs as TabsPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils';

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: TabsListProps = $props();
</script>

<TabsPrimitive.List
	bind:ref
	data-slot="tabs-list"
	class={cn(
		'inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground',
		className
	)}
	{...restProps}
/>
