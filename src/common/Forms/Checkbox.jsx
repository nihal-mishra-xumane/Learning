import { forwardRef, useEffect, useId } from 'react'
import FormField, { getDescriptionIds } from './FormField'

const Checkbox = forwardRef(function Checkbox(
  {
    id,
    label,
    description,
    error = false,
    errorMessage,
    warning = false,
    warningMessage,
    success = false,
    successMessage,
    helperText,
    indeterminate = false,
    className = '',
    required = false,
    ...props
  },
  ref,
) {
  const generatedId = useId()
  const checkboxId = id || `checkbox-${generatedId}`
  const descriptionIds = getDescriptionIds(checkboxId, error, errorMessage, helperText || description, warning, warningMessage, success, successMessage)
  const helper = helperText || description

  useEffect(() => {
    if (ref?.current) ref.current.indeterminate = indeterminate
  }, [indeterminate, ref])

  return (
    <FormField id={checkboxId} error={error} errorMessage={errorMessage} warning={warning} warningMessage={warningMessage} success={success} successMessage={successMessage} helperText={helper}>
      <label className={`common-choice ${className}`.trim()}>
        <input
          ref={ref}
          id={checkboxId}
          type="checkbox"
          className="common-choice__input"
          required={required}
          aria-invalid={error || undefined}
          aria-describedby={descriptionIds}
          {...props}
        />
        <span className="common-choice__label">
          {label}
          {required ? <span className="common-field__required" aria-hidden="true"> *</span> : null}
        </span>
      </label>
    </FormField>
  )
})

export default Checkbox