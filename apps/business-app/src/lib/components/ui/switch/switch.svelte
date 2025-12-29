<script lang="ts" module>
	import type { Switch as SwitchPrimitive } from 'bits-ui';

	export type SwitchProps = SwitchPrimitive.RootProps;
</script>

<script lang="ts">
	import { Switch as SwitchPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils';

	let {
		ref = $bindable(null),
		checked = $bindable(false),
		class: className,
		...restProps
	}: SwitchProps = $props();
</script>

<SwitchPrimitive.Root
	bind:ref
	bind:checked
	data-slot="switch"
	class={cn(
		'peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-xs',
		'transition-colors duration-200',
		'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
		'disabled:cursor-not-allowed disabled:opacity-50',
		'data-[state=unchecked]:bg-input',
		'data-[state=checked]:bg-primary',
		className
	)}
	{...restProps}
>
	<SwitchPrimitive.Thumb
		class={cn(
			'pointer-events-none block size-4 rounded-full bg-background shadow-lg ring-0',
			'transition-transform duration-200',
			'data-[state=unchecked]:translate-x-0',
			'data-[state=checked]:translate-x-4'
		)}
	/>
</SwitchPrimitive.Root>
