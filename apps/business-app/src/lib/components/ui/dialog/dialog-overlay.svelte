<script lang="ts">
	import { Dialog as DialogPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: DialogPrimitive.OverlayProps = $props();
</script>

<!-- Note: Using inline style because Tailwind v4's bg-black/50 opacity syntax isn't generating correctly -->
<DialogPrimitive.Overlay
	bind:ref
	data-slot="dialog-overlay"
	class={cn(
		"fixed inset-0 z-[1100]",
		className
	)}
	style="background-color: rgba(0, 0, 0, 0.5);"
	{...restProps}
/>
