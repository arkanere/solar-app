<script lang="ts" module>
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from "svelte/elements";
	import { type VariantProps, tv } from "tailwind-variants";

	export const buttonVariants = tv({
		base: "inline-flex shrink-0 items-center justify-center gap-[var(--button-gap)] rounded-[var(--radius-md)] text-sm font-medium whitespace-nowrap transition-all duration-100 outline-none focus-visible:ring-2 ring-ring ring-offset-2 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground hover:bg-accent-hover hover:scale-[1.02] shadow-xs",
				destructive:
					"bg-destructive text-white hover:bg-destructive-hover hover:scale-[1.02] shadow-xs dark:bg-destructive/60",
				secondary: "bg-transparent border border-border text-foreground hover:opacity-90 shadow-xs",
				ghost: "bg-transparent text-foreground hover:opacity-90",
			},
			size: {
				default: "h-[var(--button-height-default)] px-[var(--button-padding-x-default)] py-[var(--button-padding-y-default)] has-[>svg]:px-3",
				sm: "h-[var(--button-height-sm)] gap-1.5 rounded-[var(--radius-md)] px-[var(--button-padding-x-sm)] has-[>svg]:px-2.5",
				lg: "h-[var(--button-height-lg)] rounded-[var(--radius-md)] px-[var(--button-padding-x-lg)] has-[>svg]:px-4",
				icon: "size-[var(--button-icon-size-default)]",
				"icon-sm": "size-[var(--button-icon-size-sm)]",
				"icon-lg": "size-[var(--button-icon-size-lg)]",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	});

	export type ButtonVariant = VariantProps<typeof buttonVariants>["variant"];
	export type ButtonSize = VariantProps<typeof buttonVariants>["size"];

	export type ButtonProps = WithElementRef<HTMLButtonAttributes> &
		WithElementRef<HTMLAnchorAttributes> & {
			variant?: ButtonVariant;
			size?: ButtonSize;
		};
</script>

<script lang="ts">
	let {
		class: className,
		variant = "default",
		size = "default",
		ref = $bindable(null),
		href = undefined,
		type = "button",
		disabled,
		children,
		...restProps
	}: ButtonProps = $props();
</script>

{#if href}
	<a
		bind:this={ref}
		data-slot="button"
		data-variant={variant}
		data-size={size}
		class={cn(buttonVariants({ variant, size }), className)}
		href={disabled ? undefined : href}
		aria-disabled={disabled}
		role={disabled ? "link" : undefined}
		tabindex={disabled ? -1 : undefined}
		{...restProps}
	>
		{@render children?.()}
	</a>
{:else}
	<button
		bind:this={ref}
		data-slot="button"
		data-variant={variant}
		data-size={size}
		class={cn(buttonVariants({ variant, size }), className)}
		{type}
		{disabled}
		{...restProps}
	>
		{@render children?.()}
	</button>
{/if}
