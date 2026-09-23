import { forwardRef, useId } from 'react'
import FormField, { getDescriptionIds } from './FormField'

const Radio = forwardRef(function Radio(
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
    className = '',
    required = false,
    ...props
  },
  ref,
) {
  const generatedId = useId()
  const radioId = id || `radio-${generatedId}`
  const helper = helperText || description
  const descriptionIds = getDescriptionIds(radioId, error, errorMessage, helper, warning, warningMessage, success, successMessage)

  return (
    <FormField id={radioId} error={error} errorMessage={errorMessage} warning={warning} warningMessage={warningMessage} success={success} successMessage={successMessage} helperText={helper}>
      <label className={`common-choice ${className}`.trim()}>
        <input
          ref={ref}
          id={radioId}
          type="radio"
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

export default Radio