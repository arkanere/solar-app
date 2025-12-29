import Root from './dropdown-menu.svelte';
import Trigger from './dropdown-menu-trigger.svelte';
import Content from './dropdown-menu-content.svelte';
import Item from './dropdown-menu-item.svelte';
import Separator from './dropdown-menu-separator.svelte';
import Label from './dropdown-menu-label.svelte';

export type { DropdownMenuProps } from './dropdown-menu.svelte';
export type { DropdownMenuTriggerProps } from './dropdown-menu-trigger.svelte';
export type { DropdownMenuContentProps } from './dropdown-menu-content.svelte';
export type { DropdownMenuItemProps } from './dropdown-menu-item.svelte';
export type { DropdownMenuSeparatorProps } from './dropdown-menu-separator.svelte';
export type { DropdownMenuLabelProps } from './dropdown-menu-label.svelte';

export {
	Root,
	Trigger,
	Content,
	Item,
	Separator,
	Label,
	//
	Root as DropdownMenu,
	Trigger as DropdownMenuTrigger,
	Content as DropdownMenuContent,
	Item as DropdownMenuItem,
	Separator as DropdownMenuSeparator,
	Label as DropdownMenuLabel
};
