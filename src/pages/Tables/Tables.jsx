import { Columns3, Pencil, Trash2, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import DataTable from '../../common/Tables/DataTable'
import './Tables.css'

const records = [
  { id: 1, name: 'Avery Stone', category: 'Standard', score: 92, updated: '18 Sep 2026' },
  { id: 2, name: 'Mina Patel', category: 'Priority', score: 87, updated: '16 Sep 2026' },
  { id: 3, name: 'Jon Bell', category: 'Standard', score: 79, updated: '14 Sep 2026' },
  { id: 4, name: 'Riley Chen', category: 'Review', score: 74, updated: '12 Sep 2026' },
  { id: 5, name: 'Sam Rivera', category: 'Priority', score: 96, updated: '10 Sep 2026' },
  { id: 6, name: 'Noor Williams', category: 'Standard', score: 83, updated: '08 Sep 2026' },
  { id: 7, name: 'Kai Morgan', category: 'Review', score: 68, updated: '05 Sep 2026' },
  { id: 8, name: 'Terry Adams', category: 'Priority', score: 89, updated: '02 Sep 2026' },
  { id: 9, name: 'Casey Wong', category: 'Standard', score: 77, updated: '30 Aug 2026' },
  { id: 10, name: 'Drew Taylor', category: 'Review', score: 71, updated: '28 Aug 2026' },
  { id: 11, name: 'Robin Blake', category: 'Priority', score: 94, updated: '25 Aug 2026' },
  { id: 12, name: 'Jamie Reed', category: 'Standard', score: 85, updated: '22 Aug 2026' },
]

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'category', label: 'Category', sortable: true },
  { key: 'score', label: 'Score', sortable: true, align: 'right' },
  { key: 'updated', label: 'Last updated', sortable: true },
]

export default function Tables() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [hiddenColumnKeys, setHiddenColumnKeys] = useState([])
  const [columnMenuOpen, setColumnMenuOpen] = useState(false)
  const [selectedRows, setSelectedRows] = useState([])
  const filteredRecords = useMemo(() => records.filter((record) => {
    const matchesQuery = record.name.toLowerCase().includes(query.toLowerCase())
    const matchesCategory = category === 'All' || record.category === category
    return matchesQuery && matchesCategory
  }), [category, query])
  const configuredColumns = useMemo(
    () => columns.map((column) => ({ ...column, visible: !hiddenColumnKeys.includes(column.key) })),
    [hiddenColumnKeys],
  )

  function toggleColumn(key) {
    setHiddenColumnKeys((keys) => keys.includes(key) ? keys.filter((item) => item !== key) : [...keys, key])
  }

  return <div className="demo-page">
    <div className="page-heading">
      <div><p className="eyebrow">Common component</p><h1>Tables</h1><p>Configurable columns, filters, selection, actions, and pagination.</p></div>
      <span className="selection-count">{selectedRows.length} selected</span>
    </div>
    <div className={`table-workbench${columnMenuOpen ? ' has-column-menu' : ''}`}>
      <div className="table-toolbar">
        <div className="search-control">
          <label htmlFor="table-search">Search records</label>
          <input id="table-search" type="search" placeholder="Search by name" value={query} onChange={(event) => setQuery(event.target.value)} />
        </div>
        <div className="column-control">
          <button type="button" className="toolbar-button" aria-expanded={columnMenuOpen} aria-controls="column-visibility" onClick={() => setColumnMenuOpen((open) => !open)}>
            <Columns3 size={16} aria-hidden="true" /> Columns
          </button>
        </div>
      </div>
      <div className="table-filter-row">
        <div className="filter-pills" role="group" aria-label="Filter records by category">
          {['All', 'Standard', 'Priority', 'Review'].map((option) => <button key={option} type="button" className={category === option ? 'is-active' : ''} aria-pressed={category === option} onClick={() => setCategory(option)}>{option}</button>)}
        </div>
        <div className="table-meta"><span>{filteredRecords.length} records</span>{selectedRows.length > 0 && <button type="button" onClick={() => setSelectedRows([])}><X size={14} aria-hidden="true" /> Clear selection</button>}</div>
      </div>
      {columnMenuOpen && <div id="column-visibility" className="column-menu" role="group" aria-label="Visible columns">
        <span className="column-menu-label">Visible columns</span>
        {columns.map((column) => <label key={column.key}>
          <input type="checkbox" checked={!hiddenColumnKeys.includes(column.key)} onChange={() => toggleColumn(column.key)} />
          {column.label}
        </label>)}
      </div>}
    </div>
    <DataTable
      columns={configuredColumns}
      data={filteredRecords}
      getRowId={(row) => row.id}
      selectable
      selectedRowIds={selectedRows.map((row) => row.id)}
      onSelectionChange={setSelectedRows}
      rowActions={[
        { label: 'Edit row', icon: <Pencil size={16} aria-hidden="true" />, onClick: (row) => window.alert(`Edit ${row.name}`) },
        { label: 'Delete row', icon: <Trash2 size={16} aria-hidden="true" />, onClick: (row) => window.alert(`Delete ${row.name}`) },
      ]}
      hasActiveFilters={Boolean(query)}
    />
  </div>
}
