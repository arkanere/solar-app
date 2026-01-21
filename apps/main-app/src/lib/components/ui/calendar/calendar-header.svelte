<script lang="ts">
	import { Calendar as CalendarPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: CalendarPrimitive.HeaderProps = $props();
</script>

<CalendarPrimitive.Header
	bind:ref
	class={cn(
		"flex h-(--cell-size) w-full items-center justify-center",
		className
	)}
	style="gap: var(--calendar-nav-gap); font-size: var(--calendar-heading-text-size); font-weight: var(--calendar-heading-font-weight);"
	{...restProps}
/>
