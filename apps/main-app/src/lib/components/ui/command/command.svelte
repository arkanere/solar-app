<script module lang="ts">
	import { Command as CommandPrimitive } from "bits-ui";

	export type CommandRootApi = CommandPrimitive.Root;
</script>

<script lang="ts">
	import { cn } from "$lib/utils.js";

	let {
		api = $bindable<any>(null),
		ref = $bindable(null),
		value = $bindable(""),
		class: className,
		...restProps
	}: CommandPrimitive.RootProps & {
		api?: any;
	} = $props();
</script>

<CommandPrimitive.Root
	bind:this={api}
	bind:value
	bind:ref
	data-slot="command"
	class={cn(
		"bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden [border-radius:var(--command-radius)]",
		className
	)}
	{...restProps}
/>
