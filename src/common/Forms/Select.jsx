import { forwardRef, useId } from 'react'
import FormField, { getDescriptionIds } from './FormField'

const Select = forwardRef(function Select(
  {
    id,
    label,
    options = [],
    placeholder,
    emptyMessage = 'No options available',
    loading = false,
    error = false,
    errorMessage,
    warning = false,
    warningMessage,
    success = false,
    successMessage,
    helperText,
    fullWidth = false,
    size = 'md',
    className = '',
    required = false,
    disabled = false,
    ...props
  },
  ref,
) {
  const generatedId = useId()
  const selectId = id || `select-${generatedId}`
  const descriptionIds = getDescriptionIds(selectId, error, errorMessage, helperText, warning, warningMessage, success, successMessage)
  const isDisabled = disabled || loading

  return (
    <FormField id={selectId} label={label} required={required} error={error} errorMessage={errorMessage} warning={warning} warningMessage={warningMessage} success={success} successMessage={successMessage} helperText={helperText} fullWidth={fullWidth}>
      <select
        ref={ref}
        id={selectId}
        className={`common-control common-control--${size} ${error ? 'common-control--error' : ''} ${warning ? 'common-control--warning' : ''} ${success ? 'common-control--success' : ''} ${fullWidth ? 'common-control--full-width' : ''} ${className}`.trim()}
        required={required}
        disabled={isDisabled}
        aria-invalid={error || undefined}
        aria-describedby={descriptionIds}
        aria-busy={loading || undefined}
        {...props}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.length ? options.map((option) => option.options ? (
          <optgroup key={option.label} label={option.label}>
            {option.options.map((groupOption) => <option key={groupOption.value} value={groupOption.value} disabled={groupOption.disabled}>{groupOption.label}</option>)}
          </optgroup>
        ) : (
          <option key={option.value} value={option.value} disabled={option.disabled}>{option.label}</option>
        )) : <option value="" disabled>{emptyMessage}</option>}
      </select>
    </FormField>
  )
})

export default Select