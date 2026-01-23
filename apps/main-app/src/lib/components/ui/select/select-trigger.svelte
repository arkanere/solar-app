<script lang="ts">
	import { Select as SelectPrimitive } from "bits-ui";
	import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		children,
		size = "default",
		...restProps
	}: SelectPrimitive.TriggerProps & {
		size?: "sm" | "default";
	} = $props();
</script>

<SelectPrimitive.Trigger
	bind:ref
	data-slot="select-trigger"
	data-size={size}
	class={cn(
		"flex w-fit items-center justify-between gap-2 border border-input bg-transparent text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none select-none data-[placeholder]:text-muted-foreground dark:bg-input/30 dark:hover:bg-input/50 disabled:cursor-not-allowed disabled:opacity-50 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='text-'])]:text-muted-foreground",
		"rounded-[var(--radius-md)]",
		"px-[var(--select-trigger-padding-x)]",
		"py-[var(--select-trigger-padding-y)]",
		"focus-visible:ring-2 ring-ring ring-offset-2",
		"aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
		"data-[size=default]:h-[var(--select-trigger-height-default)]",
		"data-[size=sm]:h-[var(--select-trigger-height-sm)]",
		"[&_svg:not([class*='size-'])]:size-[var(--select-trigger-icon-size)]",
		className
	)}
	{...restProps}
>
	{@render children?.()}
	<ChevronDownIcon class="size-4 opacity-50" />
</SelectPrimitive.Trigger>
