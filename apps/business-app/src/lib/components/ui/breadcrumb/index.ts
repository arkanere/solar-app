import Root from './breadcrumb.svelte';
import List from './breadcrumb-list.svelte';
import Item from './breadcrumb-item.svelte';
import Link from './breadcrumb-link.svelte';
import Page from './breadcrumb-page.svelte';
import Separator from './breadcrumb-separator.svelte';
import Ellipsis from './breadcrumb-ellipsis.svelte';

export type { BreadcrumbProps } from './breadcrumb.svelte';
export type { BreadcrumbListProps } from './breadcrumb-list.svelte';
export type { BreadcrumbItemProps } from './breadcrumb-item.svelte';
export type { BreadcrumbLinkProps } from './breadcrumb-link.svelte';
export type { BreadcrumbPageProps } from './breadcrumb-page.svelte';
export type { BreadcrumbSeparatorProps } from './breadcrumb-separator.svelte';
export type { BreadcrumbEllipsisProps } from './breadcrumb-ellipsis.svelte';

export {
	Root,
	List,
	Item,
	Link,
	Page,
	Separator,
	Ellipsis,
	//
	Root as Breadcrumb,
	List as BreadcrumbList,
	Item as BreadcrumbItem,
	Link as BreadcrumbLink,
	Page as BreadcrumbPage,
	Separator as BreadcrumbSeparator,
	Ellipsis as BreadcrumbEllipsis
};
