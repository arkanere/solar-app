<script lang="ts">
	import { Tooltip as TooltipPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";
	import TooltipPortal from "./tooltip-portal.svelte";
	import type { ComponentProps } from "svelte";
	import type { WithoutChildrenOrChild } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		sideOffset = 0,
		side = "top",
		children,
		arrowClasses,
		portalProps,
		...restProps
	}: TooltipPrimitive.ContentProps & {
		arrowClasses?: string;
		portalProps?: WithoutChildrenOrChild<ComponentProps<typeof TooltipPortal>>;
	} = $props();
</script>

<TooltipPortal {...portalProps}>
	<TooltipPrimitive.Content
		bind:ref
		data-slot="tooltip-content"
		{sideOffset}
		{side}
		class={cn(
			"animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-end-2 data-[side=right]:slide-in-from-start-2 data-[side=top]:slide-in-from-bottom-2 w-fit origin-(--bits-tooltip-content-transform-origin) text-balance",
			className
		)}
		style="background-color: var(--tooltip-content-bg); color: var(--tooltip-content-text); z-index: var(--tooltip-content-z-index); border-radius: var(--tooltip-content-radius); padding-left: var(--tooltip-content-padding-x); padding-right: var(--tooltip-content-padding-x); padding-top: var(--tooltip-content-padding-y); padding-bottom: var(--tooltip-content-padding-y); font-size: var(--tooltip-content-font-size);"
		{...restProps}
	>
		{@render children?.()}
		<TooltipPrimitive.Arrow>
			{#snippet child({ props })}
				<div
					class={cn(
						"rotate-45",
						"data-[side=top]:translate-x-1/2 data-[side=top]:translate-y-[calc(-50%_+_2px)]",
						"data-[side=bottom]:-translate-x-1/2 data-[side=bottom]:-translate-y-[calc(-50%_+_1px)]",
						"data-[side=right]:translate-x-[calc(50%_+_2px)] data-[side=right]:translate-y-1/2",
						"data-[side=left]:-translate-y-[calc(50%_-_3px)]",
						arrowClasses
					)}
					style="background-color: var(--tooltip-content-bg); z-index: var(--tooltip-content-z-index); width: var(--tooltip-arrow-size); height: var(--tooltip-arrow-size); border-radius: var(--tooltip-arrow-radius);"
					{...props}
				></div>
			{/snippet}
		</TooltipPrimitive.Arrow>
	</TooltipPrimitive.Content>
</TooltipPortal>
