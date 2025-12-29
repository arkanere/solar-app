<script lang="ts" module>
	import type { Accordion as AccordionPrimitive } from 'bits-ui';

	export type AccordionItemProps = AccordionPrimitive.ItemProps;
</script>

<script lang="ts">
	import { Accordion as AccordionPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils';

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: AccordionItemProps = $props();
</script>

<AccordionPrimitive.Item
	bind:ref
	data-slot="accordion-item"
	class={cn('border-b border-border', className)}
	{...restProps}
/>
