import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal } from 'lucide-react'
import Button from './Buttons/Button'
import './DataTable.css'

function getValue(row, column) {
  if (typeof column.accessor === 'function') return column.accessor(row)
  return row[column.key]
}

function compareValues(left, right) {
  if (left == null && right == null) return 0
  if (left == null) return 1
  if (right == null) return -1
  if (typeof left === 'number' && typeof right === 'number') return left - right
  return String(left).localeCompare(String(right), undefined, { numeric: true, sensitivity: 'base' })
}

function SelectionCheckbox({ label, checked, indeterminate, disabled, onChange }) {
  const inputRef = useRef(null)

  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate
  }, [indeterminate])

  return (
    <input
      ref={inputRef}
      type="checkbox"
      aria-label={label}
      checked={checked}
      disabled={disabled}
      onChange={onChange}
    />
  )
}

function SortIndicator({ direction }) {
  if (!direction) return null
  const Icon = direction === 'asc' ? ArrowUp : ArrowDown
  return <Icon size={15} aria-hidden="true" />
}

export default function DataTable({
  columns,
  data = [],
  getRowId = (row, index) => row.id ?? index,
  rowActions = [],
  actionsLabel = 'Actions',
  selectable = false,
  selectedRowIds,
  onSelectionChange,
  defaultSort,
  sort,
  onSortChange,
  sortingMode = 'client',
  page,
  pageSize,
  defaultPageSize = 10,
  onPageChange,
  onPageSizeChange,
  totalItems,
  paginationMode = 'client',
  pageSizeOptions = [5, 10, 25],
  loading = false,
  error = null,
  onRetry,
  emptyMessage = 'No records to display.',
  noResultsMessage = 'No records match the current filters.',
  hasActiveFilters = false,
  tableLabel = 'Data table',
}) {
  const [internalSort, setInternalSort] = useState(defaultSort ?? null)
  const [internalPage, setInternalPage] = useState(1)
  const [internalPageSize, setInternalPageSize] = useState(defaultPageSize)
  const [internalSelectedIds, setInternalSelectedIds] = useState(() => new Set())

  const activeSort = sort === undefined ? internalSort : sort
  const activePage = page ?? internalPage
  const activePageSize = pageSize ?? internalPageSize
  const controlledSelection = selectedRowIds !== undefined
  const selectedIds = useMemo(
    () => new Set((controlledSelection ? selectedRowIds : [...internalSelectedIds]).map(String)),
    [controlledSelection, internalSelectedIds, selectedRowIds],
  )

  const visibleColumns = useMemo(() => columns.filter((column) => column.visible !== false), [columns])
  const indexedData = useMemo(
    () => data.map((row, index) => ({ row, index, id: String(getRowId(row, index)) })),
    [data, getRowId],
  )

  const sortedRows = useMemo(() => {
    if (sortingMode !== 'client' || !activeSort?.key) return indexedData
    const column = visibleColumns.find((item) => item.key === activeSort.key)
    if (!column?.sortable) return indexedData
    return [...indexedData].sort((left, right) => {
      const result = compareValues(getValue(left.row, column), getValue(right.row, column))
      return activeSort.direction === 'desc' ? -result : result
    })
  }, [activeSort, indexedData, sortingMode, visibleColumns])

  const itemCount = totalItems ?? data.length
  const totalPages = Math.max(1, Math.ceil(itemCount / activePageSize))
  const safePage = Math.min(Math.max(activePage, 1), totalPages)
  const visibleRows = paginationMode === 'client'
    ? sortedRows.slice((safePage - 1) * activePageSize, safePage * activePageSize)
    : sortedRows
  const rowIds = visibleRows.map(({ id }) => id)
  const selectedVisibleCount = rowIds.filter((id) => selectedIds.has(id)).length
  const allVisibleSelected = rowIds.length > 0 && selectedVisibleCount === rowIds.length
  const someVisibleSelected = selectedVisibleCount > 0 && !allVisibleSelected
  const columnCount = visibleColumns.length + (selectable ? 1 : 0) + (rowActions.length ? 1 : 0)

  function changePage(nextPage) {
    const next = Math.min(Math.max(nextPage, 1), totalPages)
    setInternalPage(next)
    onPageChange?.(next)
  }

  function changePageSize(nextSize) {
    const size = Number(nextSize)
    setInternalPageSize(size)
    setInternalPage(1)
    onPageSizeChange?.(size)
    onPageChange?.(1)
  }

  function changeSort(key) {
    const column = visibleColumns.find((item) => item.key === key)
    if (!column?.sortable) return
    const nextSort = activeSort?.key !== key
      ? { key, direction: 'asc' }
      : activeSort.direction === 'asc'
        ? { key, direction: 'desc' }
        : null
    setInternalSort(nextSort)
    onSortChange?.(nextSort)
  }

  function emitSelection(nextIds) {
    const nextRows = indexedData.filter(({ id }) => nextIds.has(id)).map(({ row }) => row)
    if (!controlledSelection) setInternalSelectedIds(nextIds)
    onSelectionChange?.(nextRows, [...nextIds])
  }

  function toggleRow(id) {
    const nextIds = new Set(selectedIds)
    if (nextIds.has(id)) nextIds.delete(id)
    else nextIds.add(id)
    emitSelection(nextIds)
  }

  function toggleAllVisible() {
    const nextIds = new Set(selectedIds)
    if (allVisibleSelected) rowIds.forEach((id) => nextIds.delete(id))
    else rowIds.forEach((id) => nextIds.add(id))
    emitSelection(nextIds)
  }

  function renderState() {
    if (loading) {
      return Array.from({ length: Math.min(activePageSize, 5) }, (_, index) => (
        <tr key={`loading-${index}`}>
          <td colSpan={columnCount}><span className="table-skeleton" /></td>
        </tr>
      ))
    }
    if (error) {
      return <tr><td colSpan={columnCount} className="table-state table-error" role="alert">
        <strong>Unable to load records</strong>
        <span>{typeof error === 'string' ? error : error.message ?? 'Something went wrong.'}</span>
        {onRetry && <Button variant="secondary" onClick={onRetry}>Try again</Button>}
      </td></tr>
    }
    if (!visibleRows.length) {
      return <tr><td colSpan={columnCount} className="table-state">
        {hasActiveFilters ? noResultsMessage : emptyMessage}
      </td></tr>
    }
    return visibleRows.map(({ row, id }, rowIndex) => {
      return <tr key={id} className={selectedIds.has(id) ? 'is-selected' : ''}>
        {selectable && <td className="table-selection"><SelectionCheckbox label={`Select row ${rowIndex + 1}`} checked={selectedIds.has(id)} onChange={() => toggleRow(id)} /></td>}
        {visibleColumns.map((column) => <td key={column.key} style={{ width: column.width, minWidth: column.minWidth }} className={`align-${column.align ?? 'left'}`}>
          {column.render ? column.render(getValue(row, column), row) : getValue(row, column) ?? '—'}
        </td>)}
        {rowActions.length > 0 && <td className="table-actions">
          {rowActions.map((action) => {
            if (action.hidden?.(row)) return null
            return <button key={action.label} type="button" className="icon-button" aria-label={action.label} title={action.label} disabled={action.disabled?.(row)} onClick={() => action.onClick(row)}>
              {action.icon ?? <MoreHorizontal size={18} aria-hidden="true" />}
            </button>
          })}
        </td>}
      </tr>
    })
  }

  return <div className="data-table">
    <div className="table-scroll" tabIndex="0" aria-busy={loading}>
      <table aria-label={tableLabel}>
        <thead>
          <tr>
            {selectable && <th className="table-selection"><SelectionCheckbox label="Select all visible rows" checked={allVisibleSelected} indeterminate={someVisibleSelected} disabled={!rowIds.length || loading} onChange={toggleAllVisible} /></th>}
            {visibleColumns.map((column) => <th key={column.key} scope="col" style={{ width: column.width, minWidth: column.minWidth }} className={`align-${column.align ?? 'left'}`} aria-sort={column.sortable ? activeSort?.key === column.key ? activeSort.direction === 'asc' ? 'ascending' : 'descending' : 'none' : undefined}>
              {column.sortable ? <button type="button" className="sort-button" onClick={() => changeSort(column.key)} aria-label={`Sort by ${column.label}${activeSort?.key === column.key ? `, currently ${activeSort.direction === 'asc' ? 'ascending' : 'descending'}` : ''}`}>
                <span>{column.label}</span><SortIndicator direction={activeSort?.key === column.key ? activeSort.direction : null} />
              </button> : column.label}
            </th>)}
            {rowActions.length > 0 && <th scope="col" className="table-actions">{actionsLabel}</th>}
          </tr>
        </thead>
        <tbody>{renderState()}</tbody>
      </table>
    </div>
    <div className="pagination" aria-label="Pagination">
      <label>Rows per page <select value={activePageSize} onChange={(event) => changePageSize(event.target.value)}>
        {pageSizeOptions.map((size) => <option key={size} value={size}>{size}</option>)}
      </select></label>
      <span className="pagination-summary">{itemCount ? `${(safePage - 1) * activePageSize + 1}-${Math.min(safePage * activePageSize, itemCount)} of ${itemCount}` : '0 records'}</span>
      <div className="pagination-buttons">
        <button type="button" className="icon-button" aria-label="First page" disabled={safePage === 1 || loading} onClick={() => changePage(1)}><ChevronsLeft size={18} aria-hidden="true" /></button>
        <button type="button" className="icon-button" aria-label="Previous page" disabled={safePage === 1 || loading} onClick={() => changePage(safePage - 1)}><ChevronLeft size={18} aria-hidden="true" /></button>
        <span aria-live="polite">Page {safePage} of {totalPages}</span>
        <button type="button" className="icon-button" aria-label="Next page" disabled={safePage === totalPages || loading} onClick={() => changePage(safePage + 1)}><ChevronRight size={18} aria-hidden="true" /></button>
        <button type="button" className="icon-button" aria-label="Last page" disabled={safePage === totalPages || loading} onClick={() => changePage(totalPages)}><ChevronsRight size={18} aria-hidden="true" /></button>
      </div>
    </div>
  </div>
}
