import Root from './stepper.svelte';
import Item from './stepper-item.svelte';
import Separator from './stepper-separator.svelte';

export type { StepperProps } from './stepper.svelte';
export type { StepperItemProps } from './stepper-item.svelte';
export type { StepperSeparatorProps } from './stepper-separator.svelte';

export {
	Root,
	Item,
	Separator,
	//
	Root as Stepper,
	Item as StepperItem,
	Separator as StepperSeparator
};
