<script lang="ts" module>
	import { type VariantProps, tv } from "tailwind-variants";

	export const badgeVariants = tv({
		base: "inline-flex w-fit shrink-0 items-center justify-center border whitespace-nowrap transition-[color,box-shadow] overflow-hidden focus-visible:ring-2 ring-ring ring-offset-2 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive" +
			" [&]:gap-[var(--badge-gap)]" +
			" [&]:rounded-[var(--badge-radius)]" +
			" [&]:px-[var(--badge-padding-x)]" +
			" [&]:py-[var(--badge-padding-y)]" +
			" [&]:text-[var(--badge-font-size)]" +
			" [&]:font-[var(--badge-font-weight)]" +
			" [&>svg]:pointer-events-none" +
			" [&>svg]:size-[var(--badge-icon-size)]",
		variants: {
			variant: {
				default:
					"bg-primary text-primary-foreground [a&]:hover:bg-accent-hover border-transparent",
				secondary:
					"bg-secondary text-secondary-foreground [a&]:hover:opacity-90 border-transparent",
				destructive:
					"bg-destructive text-white [a&]:hover:bg-destructive-hover border-transparent dark:bg-destructive/70",
				outline: "text-foreground [a&]:hover:opacity-90",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	});

	export type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];
</script>

<script lang="ts">
	import type { HTMLAnchorAttributes } from "svelte/elements";
	import { cn, type WithElementRef } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		href,
		class: className,
		variant = "default",
		children,
		...restProps
	}: WithElementRef<HTMLAnchorAttributes> & {
		variant?: BadgeVariant;
	} = $props();
</script>

<svelte:element
	this={href ? "a" : "span"}
	bind:this={ref}
	data-slot="badge"
	{href}
	class={cn(badgeVariants({ variant }), className)}
	{...restProps}
>
	{@render children?.()}
</svelte:element>
