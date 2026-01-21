<script lang="ts">
	import { Tabs as TabsPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: TabsPrimitive.ListProps = $props();
</script>

<TabsPrimitive.List
	bind:ref
	data-slot="tabs-list"
	class={cn(
		"inline-flex w-fit items-center justify-center",
		className
	)}
	style="height: var(--tabs-list-height); background-color: var(--tabs-list-bg); color: var(--tabs-list-text-color); border-radius: var(--tabs-list-radius); padding: var(--tabs-list-padding)"
	{...restProps}
/>
