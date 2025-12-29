import Root from './select.svelte';
import Trigger from './select-trigger.svelte';
import Content from './select-content.svelte';
import Item from './select-item.svelte';
import Separator from './select-separator.svelte';
import Label from './select-label.svelte';
import Group from './select-group.svelte';
import Value from './select-value.svelte';

export type { SelectProps } from './select.svelte';
export type { SelectTriggerProps } from './select-trigger.svelte';
export type { SelectContentProps } from './select-content.svelte';
export type { SelectItemProps } from './select-item.svelte';
export type { SelectSeparatorProps } from './select-separator.svelte';
export type { SelectLabelProps } from './select-label.svelte';
export type { SelectGroupProps } from './select-group.svelte';
export type { SelectValueProps } from './select-value.svelte';

export {
	Root,
	Trigger,
	Content,
	Item,
	Separator,
	Label,
	Group,
	Value,
	//
	Root as Select,
	Trigger as SelectTrigger,
	Content as SelectContent,
	Item as SelectItem,
	Separator as SelectSeparator,
	Label as SelectLabel,
	Group as SelectGroup,
	Value as SelectValue
};
