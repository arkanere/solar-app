import Root from './alert.svelte';
import Title from './alert-title.svelte';
import Description from './alert-description.svelte';

export type { AlertProps, AlertVariant } from './alert.svelte';
export type { AlertTitleProps } from './alert-title.svelte';
export type { AlertDescriptionProps } from './alert-description.svelte';

export {
	Root,
	Root as Alert,
	Title,
	Title as AlertTitle,
	Description,
	Description as AlertDescription
};
