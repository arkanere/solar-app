<script lang="ts" module>
	import type { Accordion as AccordionPrimitive } from 'bits-ui';

	export type AccordionTriggerProps = AccordionPrimitive.TriggerProps;
</script>

<script lang="ts">
	import { Accordion as AccordionPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils';
	import { ChevronDown } from '@lucide/svelte';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: AccordionTriggerProps = $props();
</script>

<AccordionPrimitive.Header class="flex">
	<AccordionPrimitive.Trigger
		bind:ref
		data-slot="accordion-trigger"
		class={cn(
			'flex flex-1 items-center justify-between py-4 text-sm font-medium',
			'transition-all hover:underline',
			'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
			'[&[data-state=open]>svg]:rotate-180',
			className
		)}
		{...restProps}
	>
		{@render children?.()}
		<ChevronDown class="size-4 shrink-0 text-foreground-muted transition-transform duration-200" />
	</AccordionPrimitive.Trigger>
</AccordionPrimitive.Header>
