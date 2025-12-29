<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';
	import { tv, type VariantProps } from 'tailwind-variants';

	const alertVariants = tv({
		base: 'relative w-full rounded-lg border p-4',
		variants: {
			variant: {
				default: 'bg-background text-foreground border-border',
				destructive: 'bg-destructive/10 text-destructive border-destructive/50',
				success: 'bg-success/10 text-success border-success/50',
				warning: 'bg-warning/10 text-warning border-warning/50'
			}
		},
		defaultVariants: {
			variant: 'default'
		}
	});

	export type AlertVariant = VariantProps<typeof alertVariants>['variant'];
	export type AlertProps = HTMLAttributes<HTMLDivElement> &
		VariantProps<typeof alertVariants> & {
			children: Snippet;
		};
</script>

<script lang="ts">
	let { variant = 'default', class: className, children, ...restProps }: AlertProps = $props();
</script>

<div
	role="alert"
	data-slot="alert"
	class={cn(alertVariants({ variant }), className)}
	{...restProps}
>
	{@render children()}
</div>
