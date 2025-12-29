<script lang="ts" module>
	import type { Accordion as AccordionPrimitive } from 'bits-ui';

	export type AccordionContentProps = AccordionPrimitive.ContentProps;
</script>

<script lang="ts">
	import { Accordion as AccordionPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: AccordionContentProps = $props();
</script>

<AccordionPrimitive.Content
	bind:ref
	data-slot="accordion-content"
	class={cn(
		'overflow-hidden text-sm',
		'data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up'
	)}
	{...restProps}
>
	<div class={cn('pb-4 pt-0', className)}>
		{@render children?.()}
	</div>
</AccordionPrimitive.Content>
