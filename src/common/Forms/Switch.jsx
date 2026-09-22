import { forwardRef, useId } from 'react'
import FormField, { getDescriptionIds } from './FormField'

const Switch = forwardRef(function Switch(
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
  const switchId = id || `switch-${generatedId}`
  const helper = helperText || description
  const descriptionIds = getDescriptionIds(switchId, error, errorMessage, helper, warning, warningMessage, success, successMessage)

  return (
    <FormField id={switchId} error={error} errorMessage={errorMessage} warning={warning} warningMessage={warningMessage} success={success} successMessage={successMessage} helperText={helper}>
      <label className={`common-switch ${className}`.trim()}>
        <input ref={ref} id={switchId} type="checkbox" className="common-switch__input" required={required} aria-invalid={error || undefined} aria-describedby={descriptionIds} role="switch" {...props} />
        <span className="common-switch__track" aria-hidden="true"><span className="common-switch__thumb" /></span>
        <span className="common-choice__label">{label}{required ? <span className="common-field__required" aria-hidden="true"> *</span> : null}</span>
      </label>
    </FormField>
  )
})

export default Switch
