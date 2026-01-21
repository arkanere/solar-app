<script lang="ts">
	import { NavigationMenu as NavigationMenuPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: NavigationMenuPrimitive.ViewportProps = $props();
</script>

<div class={cn("absolute start-0 top-full isolate z-50 flex justify-center")}>
	<NavigationMenuPrimitive.Viewport
		bind:ref
		data-slot="navigation-menu-viewport"
		class={cn(
			"origin-top-center bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 relative h-[var(--bits-navigation-menu-viewport-height)] w-full overflow-hidden border shadow md:w-[var(--bits-navigation-menu-viewport-width)]",
			className
		)}
		style={`
			margin-top: var(--navigation-menu-viewport-offset);
			border-radius: var(--navigation-menu-viewport-radius);
		`}
		{...restProps}
	/>
</div>
