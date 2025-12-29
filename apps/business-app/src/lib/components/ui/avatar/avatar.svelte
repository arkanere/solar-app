<script lang="ts" module>
	import type { Avatar as AvatarPrimitive } from 'bits-ui';
	import { tv, type VariantProps } from 'tailwind-variants';

	const avatarVariants = tv({
		base: 'relative flex shrink-0 overflow-hidden rounded-full',
		variants: {
			size: {
				sm: 'size-8',
				md: 'size-10',
				lg: 'size-12',
				xl: 'size-16'
			}
		},
		defaultVariants: {
			size: 'md'
		}
	});

	export type AvatarProps = AvatarPrimitive.RootProps & VariantProps<typeof avatarVariants>;
	export { avatarVariants };
</script>

<script lang="ts">
	import { Avatar as AvatarPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils';

	let {
		ref = $bindable(null),
		class: className,
		size = 'md',
		...restProps
	}: AvatarProps = $props();
</script>

<AvatarPrimitive.Root
	bind:ref
	data-slot="avatar"
	class={cn(avatarVariants({ size }), className)}
	{...restProps}
/>
