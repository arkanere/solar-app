<script lang="ts" module>
	import type { RadioGroup as RadioGroupPrimitive } from 'bits-ui';

	export type RadioGroupProps = RadioGroupPrimitive.RootProps;
</script>

<script lang="ts">
	import { RadioGroup as RadioGroupPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils';

	let {
		ref = $bindable(null),
		value = $bindable(''),
		class: className,
		orientation = 'vertical',
		...restProps
	}: RadioGroupProps = $props();
</script>

<RadioGroupPrimitive.Root
	bind:ref
	bind:value
	data-slot="radio-group"
	class={cn(
		'grid gap-2',
		orientation === 'horizontal' && 'flex flex-row gap-4',
		className
	)}
	{orientation}
	{...restProps}
/>
