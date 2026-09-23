# DataTable

Data table with sortable columns, client- or server-side pagination and
sorting, row selection, per-row actions, and loading/error/empty states.
Self-contained — copy `Tables/` (both files) into another project and it
works unchanged.

## Usage

```jsx
import { DataTable } from '../../common'

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'score', label: 'Score', sortable: true, align: 'right' },
]

<DataTable
  columns={columns}
  data={records}
  getRowId={(row) => row.id}
  selectable
  selectedRowIds={selectedIds}
  onSelectionChange={setSelectedIds}
  rowActions={[
    { label: 'Edit', icon: <Pencil size={16} />, onClick: (row) => editRow(row) },
  ]}
/>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `columns` | `{ key, label, sortable?, align?, width?, minWidth?, accessor?, render?, visible? }[]` | — | Column definitions. `accessor(row)` overrides reading `row[key]`; `render(value, row)` overrides how the cell is drawn. |
| `data` | array | `[]` | Rows to display (already-filtered — DataTable doesn't filter). |
| `getRowId` | `(row, index) => string \| number` | `row.id ?? index` | Row identity, used for selection and React keys. |
| `rowActions` | `{ label, icon?, onClick, disabled?(row), hidden?(row) }[]` | `[]` | Per-row icon-button actions rendered in a trailing column. |
| `actionsLabel` | string | `"Actions"` | Header text for the actions column. |
| `selectable` | boolean | `false` | Show row/select-all checkboxes. |
| `selectedRowIds` | array | — | Controlled selection. Omit to let DataTable manage its own selection state. |
| `onSelectionChange` | `(rows, ids) => void` | — | Called with the newly selected rows/ids whenever selection changes. |
| `defaultSort` / `sort` | `{ key, direction: 'asc' \| 'desc' }` | — | Uncontrolled / controlled sort state. |
| `onSortChange` | `(sort) => void` | — | Called when the user clicks a sortable header. |
| `sortingMode` | `'client' \| 'server'` | `'client'` | `'server'` disables in-component sorting; you sort `data` yourself and use `onSortChange`. |
| `page` / `pageSize` | number | — | Controlled pagination state. Omit to let DataTable manage its own. |
| `defaultPageSize` | number | `10` | Initial page size when uncontrolled. |
| `onPageChange` / `onPageSizeChange` | function | — | Called on page/page-size changes. |
| `totalItems` | number | `data.length` | Needed for `paginationMode: 'server'` so DataTable knows the real total. |
| `paginationMode` | `'client' \| 'server'` | `'client'` | `'server'` disables in-component slicing; pass already-paginated `data`. |
| `pageSizeOptions` | number[] | `[5, 10, 25]` | Options in the rows-per-page select. |
| `loading` | boolean | `false` | Shows skeleton rows. |
| `error` | string \| Error | — | Shows an error row with a "Try again" button (if `onRetry` is passed). |
| `onRetry` | `() => void` | — | Called from the error row's retry button. |
| `emptyMessage` | string | `"No records to display."` | Shown when `data` is empty and no filters are active. |
| `noResultsMessage` | string | `"No records match the current filters."` | Shown when `data` is empty and `hasActiveFilters` is true. |
| `hasActiveFilters` | boolean | `false` | Selects which empty-state message to show. |
| `tableLabel` | string | `"Data table"` | `aria-label` on the `<table>`. |

## Notes

- All CSS classes are prefixed with `data-table__` specifically so they can't
  collide with a host app's own classes after copying — don't add new
  unprefixed class names (e.g. a bare `.pagination` or `.icon-button`) to
  `DataTable.css`.
- The demo page at `src/pages/Tables/Tables.jsx` shows the toolbar/column-
  visibility/filter chrome you'd typically build around this component; that
  chrome is page-specific and not part of `DataTable` itself.
