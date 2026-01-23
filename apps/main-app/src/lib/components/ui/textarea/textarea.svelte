<script lang="ts">
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLTextareaAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		value = $bindable(),
		class: className,
		"data-slot": dataSlot = "textarea",
		...restProps
	}: WithElementRef<HTMLTextareaAttributes> = $props();
</script>

<textarea
	bind:this={ref}
	data-slot={dataSlot}
	class={cn(
		"flex field-sizing-content min-h-[var(--textarea-min-height)] w-full rounded-[var(--radius-md)] border border-input bg-background px-[var(--textarea-padding-x)] py-[var(--textarea-padding-y)] text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground dark:bg-input/30 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
		"focus-visible:ring-2 ring-ring ring-offset-2",
		"aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
		className
	)}
	bind:value
	{...restProps}
></textarea>
