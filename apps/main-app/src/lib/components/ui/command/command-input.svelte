<script lang="ts">
	import { Command as CommandPrimitive } from "bits-ui";
	import SearchIcon from "@lucide/svelte/icons/search";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		value = $bindable(""),
		...restProps
	}: CommandPrimitive.InputProps = $props();
</script>

<div class="flex items-center border-b [height:var(--command-input-wrapper-height)] [gap:var(--command-border-gap)] [padding-inline-start:var(--command-input-wrapper-padding-start)] [padding-inline-end:var(--command-input-wrapper-padding-end)]" data-slot="command-input-wrapper">
	<SearchIcon class="size-4 shrink-0 opacity-50" />
	<CommandPrimitive.Input
		data-slot="command-input"
		class={cn(
			"placeholder:text-muted-foreground flex w-full bg-transparent text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50 [height:var(--command-input-height)] [border-radius:var(--command-radius)] [padding-block:var(--command-input-padding-y)]",
			className
		)}
		bind:ref
		{...restProps}
		bind:value
	/>
</div>
