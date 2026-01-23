<script lang="ts">
	import { Tabs as TabsPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: TabsPrimitive.TriggerProps = $props();
</script>

<TabsPrimitive.Trigger
	bind:ref
	data-slot="tabs-trigger"
	class={cn(
		"inline-flex flex-1 items-center justify-center border border-transparent whitespace-nowrap transition-[color,box-shadow] text-foreground dark:text-muted-foreground data-[state=active]:bg-background data-[state=active]:shadow-card dark:data-[state=active]:text-foreground dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 focus-visible:ring-2 ring-ring ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
		className
	)}
	style="height: var(--tabs-trigger-height-calc); gap: var(--tabs-trigger-gap); border-radius: var(--tabs-trigger-radius); padding-left: var(--tabs-trigger-padding-x); padding-right: var(--tabs-trigger-padding-x); padding-top: var(--tabs-trigger-padding-y); padding-bottom: var(--tabs-trigger-padding-y); font-size: var(--tabs-trigger-font-size); font-weight: var(--tabs-trigger-font-weight);"
	{...restProps}
/>
