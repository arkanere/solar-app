import Root from './accordion.svelte';
import Item from './accordion-item.svelte';
import Trigger from './accordion-trigger.svelte';
import Content from './accordion-content.svelte';

export type { AccordionProps } from './accordion.svelte';
export type { AccordionItemProps } from './accordion-item.svelte';
export type { AccordionTriggerProps } from './accordion-trigger.svelte';
export type { AccordionContentProps } from './accordion-content.svelte';

export {
	Root,
	Item,
	Trigger,
	Content,
	//
	Root as Accordion,
	Item as AccordionItem,
	Trigger as AccordionTrigger,
	Content as AccordionContent
};
