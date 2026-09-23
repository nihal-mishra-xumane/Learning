import { forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'

/**
 * Dropdown built on the native `<select>`.
 *
 * Deliberately not a custom listbox: the native control already gives us
 * keyboard support, type-ahead, screen-reader semantics and a usable picker on
 * mobile, for none of the bundle size.
 *
 * Options accept `{ value, label, disabled }` or plain strings.
 */
const Select = forwardRef(function Select(
  { options = [], value, onChange, placeholder, disabled = false, invalid = false, className = '', ...rest },
  ref,
) {
  const normalized = options.map((option) =>
    typeof option === 'string' ? { value: option, label: option } : option,
  )

  return (
    <div className={`ui-select ${className}`.trim()}>
      <select
        ref={ref}
        className="ui-input"
        value={value ?? ''}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        onChange={(event) => onChange?.(event.target.value, event)}
        {...rest}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {normalized.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="ui-select-icon" size={16} aria-hidden="true" />
    </div>
  )
})

export default Select
