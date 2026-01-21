<script lang="ts">
	import { NavigationMenu as NavigationMenuPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: NavigationMenuPrimitive.IndicatorProps = $props();
</script>

<NavigationMenuPrimitive.Indicator
	bind:ref
	data-slot="navigation-menu-indicator"
	class={cn(
		"data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in top-full z-[1] flex items-end justify-center overflow-hidden",
		className
	)}
	style={`
		height: var(--navigation-menu-indicator-height);
	`}
	{...restProps}
>
	<div
		class="bg-border relative rotate-45"
		style={`
			width: var(--navigation-menu-indicator-marker-width);
			height: var(--navigation-menu-indicator-marker-height);
			border-radius: var(--navigation-menu-indicator-marker-radius);
			top: 60%;
			box-shadow: var(--navigation-menu-indicator-marker-shadow);
		`}
	></div>
</NavigationMenuPrimitive.Indicator>
