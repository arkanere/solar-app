<script lang="ts" module>
	import { cn } from "$lib/utils.js";
	import { tv } from "tailwind-variants";

	export const navigationMenuTriggerStyle = tv({
		base: "group inline-flex w-max items-center justify-center font-medium transition-[color,box-shadow] outline-none bg-background hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent/50 data-[state=open]:text-accent-foreground data-[state=open]:hover:bg-accent data-[state=open]:focus:bg-accent focus-visible:ring-2 ring-ring ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
	});
</script>

<script lang="ts">
	import { NavigationMenu as NavigationMenuPrimitive } from "bits-ui";
	import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: NavigationMenuPrimitive.TriggerProps = $props();
</script>

<NavigationMenuPrimitive.Trigger
	bind:ref
	data-slot="navigation-menu-trigger"
	class={cn(navigationMenuTriggerStyle(), "group", className)}
	style={`
		height: var(--navigation-menu-trigger-height);
		padding-left: var(--navigation-menu-trigger-padding-x);
		padding-right: var(--navigation-menu-trigger-padding-x);
		padding-top: var(--navigation-menu-trigger-padding-y);
		padding-bottom: var(--navigation-menu-trigger-padding-y);
		border-radius: var(--navigation-menu-trigger-radius);
		font-size: var(--navigation-menu-trigger-font-size);
	`}
	{...restProps}
>
	{@render children?.()}

	<ChevronDownIcon
		style={`
			width: var(--navigation-menu-trigger-icon-size);
			height: var(--navigation-menu-trigger-icon-size);
			margin-left: var(--navigation-menu-trigger-icon-margin-start);
		`}
		class="relative top-[1px] transition duration-100 group-data-[state=open]:rotate-180"
		aria-hidden="true"
	/>
</NavigationMenuPrimitive.Trigger>
