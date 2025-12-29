<script lang="ts" module>
	import type { Accordion as AccordionPrimitive } from 'bits-ui';

	export type AccordionProps = AccordionPrimitive.RootProps;
</script>

<script lang="ts">
	import { Accordion as AccordionPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils';

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: AccordionProps = $props();
</script>

<AccordionPrimitive.Root
	bind:ref
	data-slot="accordion"
	class={cn('w-full', className)}
	{...restProps}
/>
