<script lang="ts" module>
	import type { Avatar as AvatarPrimitive } from 'bits-ui';

	export type AvatarFallbackProps = AvatarPrimitive.FallbackProps;
</script>

<script lang="ts">
	import { Avatar as AvatarPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils';

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: AvatarFallbackProps = $props();
</script>

<AvatarPrimitive.Fallback
	bind:ref
	data-slot="avatar-fallback"
	class={cn(
		'flex size-full items-center justify-center rounded-full bg-muted text-muted-foreground font-medium',
		className
	)}
	{...restProps}
/>
