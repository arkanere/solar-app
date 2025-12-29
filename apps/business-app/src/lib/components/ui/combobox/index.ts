import Root from './combobox.svelte';
import Input from './combobox-input.svelte';
import Trigger from './combobox-trigger.svelte';
import Content from './combobox-content.svelte';
import Item from './combobox-item.svelte';
import Empty from './combobox-empty.svelte';
import Group from './combobox-group.svelte';
import Label from './combobox-label.svelte';

export type { ComboboxProps } from './combobox.svelte';
export type { ComboboxInputProps } from './combobox-input.svelte';
export type { ComboboxTriggerProps } from './combobox-trigger.svelte';
export type { ComboboxContentProps } from './combobox-content.svelte';
export type { ComboboxItemProps } from './combobox-item.svelte';
export type { ComboboxEmptyProps } from './combobox-empty.svelte';
export type { ComboboxGroupProps } from './combobox-group.svelte';
export type { ComboboxLabelProps } from './combobox-label.svelte';

export {
	Root,
	Input,
	Trigger,
	Content,
	Item,
	Empty,
	Group,
	Label,
	//
	Root as Combobox,
	Input as ComboboxInput,
	Trigger as ComboboxTrigger,
	Content as ComboboxContent,
	Item as ComboboxItem,
	Empty as ComboboxEmpty,
	Group as ComboboxGroup,
	Label as ComboboxLabel
};
