import Root from './data-table.svelte';
import Header from './table-header.svelte';
import Row from './table-row.svelte';
import Cell from './table-cell.svelte';

export type { DataTableProps } from './data-table.svelte';
export type { TableHeaderProps } from './table-header.svelte';
export type { TableRowProps } from './table-row.svelte';
export type { TableCellProps } from './table-cell.svelte';

export {
	Root,
	Root as DataTable,
	Header,
	Header as TableHeader,
	Row,
	Row as TableRow,
	Cell,
	Cell as TableCell
};
