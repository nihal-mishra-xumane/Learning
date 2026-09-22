import { useId } from 'react'
import { Bell, ChevronDown, Search } from 'lucide-react'
import { Button } from '../../common/components'

/**
 * Live preview of the current theme.
 *
 * Built from the same `ui-` classes and tokens as the real screens, so it
 * cannot drift from the app: if an element looks right here, it looks right
 * everywhere.
 *
 * Purely presentational and free of domain content - the defaults are neutral
 * placeholders. Any app can pass its own sample content in if it wants the
 * preview to look like its own screens.
 */

const DEFAULT_NAV = ['Overview', 'Records', 'Reports']

const DEFAULT_FIELDS = [
  { label: 'Text input', value: 'Sample value' },
  { label: 'Required input', value: 'Another value', required: true, hint: 'Helper text.' },
  { label: 'Disabled input', value: 'Not editable', disabled: true },
]

const DEFAULT_COLUMNS = ['Name', 'Value', 'Status']

const DEFAULT_ROWS = [
  { name: 'First item', value: '120', status: 'Active', tone: 'success' },
  { name: 'Second item', value: '1,500', status: 'Pending', tone: 'warning' },
  { name: 'Third item', value: '60', status: 'Inactive', tone: 'danger' },
]

const DEFAULT_ACTIONS = [
  { label: 'Cancel', variant: 'ghost' },
  { label: 'Secondary', variant: 'secondary', endIcon: ChevronDown },
  { label: 'Primary', variant: 'primary' },
]

export default function ThemePreview({
  brand = 'Application',
  navItems = DEFAULT_NAV,
  title = 'Card title',
  subtitle = 'Supporting line of text',
  badge = { label: 'Status', tone: 'info' },
  fields = DEFAULT_FIELDS,
  columns = DEFAULT_COLUMNS,
  rows = DEFAULT_ROWS,
  actions = DEFAULT_ACTIONS,
}) {
  const fieldId = useId()

  return (
    <div className="preview" aria-label="Live preview">
      <div className="preview-navbar">
        <span className="preview-logo" aria-hidden="true" />
        <strong className="preview-brand">{brand}</strong>
        <nav className="preview-nav" aria-hidden="true">
          {navItems.map((item, index) => (
            <span
              key={item}
              className={`preview-nav-item ${index === 0 ? 'preview-nav-active' : ''}`.trim()}
            >
              {item}
            </span>
          ))}
        </nav>
        <span className="preview-nav-icons" aria-hidden="true">
          <Search size={16} />
          <Bell size={16} />
        </span>
      </div>

      <div className="preview-body">
        <section className="ui-card">
          <header className="ui-card-header">
            <div>
              <h3 className="ui-title-sm">{title}</h3>
              {subtitle ? <p className="ui-text-muted">{subtitle}</p> : null}
            </div>
            {badge ? <span className={`ui-badge ui-badge-${badge.tone}`}>{badge.label}</span> : null}
          </header>

          <div className="ui-card-body ui-stack">
            {fields.map((field, index) => {
              const id = `${fieldId}-${index}`
              return (
                <div className="ui-field" key={field.label}>
                  <label
                    className={`ui-label ${field.required ? 'ui-label-required' : ''}`.trim()}
                    htmlFor={id}
                  >
                    {field.label}
                  </label>
                  <input
                    id={id}
                    className="ui-input"
                    defaultValue={field.value}
                    disabled={field.disabled}
                    aria-describedby={field.hint ? `${id}-hint` : undefined}
                    readOnly
                  />
                  {field.hint ? (
                    <p className="ui-hint" id={`${id}-hint`}>
                      {field.hint}
                    </p>
                  ) : null}
                </div>
              )
            })}

            <div className="ui-table-wrap">
              <table className="ui-table">
                <thead>
                  <tr>
                    {columns.map((column, index) => (
                      <th key={column} scope="col" className={index === 1 ? 'ui-numeric' : undefined}>
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.name}>
                      <td>{row.name}</td>
                      <td className="ui-numeric">{row.value}</td>
                      <td>
                        <span className={`ui-badge ui-badge-${row.tone}`}>{row.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <footer className="ui-card-footer">
            {actions.map((action) => (
              <Button key={action.label} variant={action.variant} endIcon={action.endIcon}>
                {action.label}
              </Button>
            ))}
          </footer>
        </section>
      </div>
    </div>
  )
}
