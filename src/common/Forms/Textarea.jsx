import { forwardRef, useId, useState } from 'react'
import FormField, { getDescriptionIds } from './FormField'

const Textarea = forwardRef(function Textarea(
  {
    id,
    label,
    error = false,
    errorMessage,
    warning = false,
    warningMessage,
    success = false,
    successMessage,
    helperText,
    fullWidth = false,
    size = 'md',
    characterLimit,
    showCounter = false,
    resize = 'vertical',
    className = '',
    required = false,
    value,
    defaultValue,
    onChange,
    ...props
  },
  ref,
) {
  const generatedId = useId()
  const textareaId = id || `textarea-${generatedId}`
  const [internalValue, setInternalValue] = useState(defaultValue || '')
  const isControlled = value !== undefined
  const currentValue = isControlled ? value : internalValue
  const descriptionIds = getDescriptionIds(textareaId, error, errorMessage, helperText, warning, warningMessage, success, successMessage)
  const counter = showCounter || characterLimit ? `${String(currentValue || '').length}${characterLimit ? `/${characterLimit}` : ''}` : null
  const handleChange = (event) => {
    if (!isControlled) setInternalValue(event.target.value)
    onChange?.(event)
  }

  return (
    <FormField id={textareaId} label={label} required={required} error={error} errorMessage={errorMessage} warning={warning} warningMessage={warningMessage} success={success} successMessage={successMessage} helperText={helperText} counter={counter} fullWidth={fullWidth}>
      <textarea
        ref={ref}
        id={textareaId}
        className={`common-control common-control--textarea common-control--${size} common-control--resize-${resize} ${error ? 'common-control--error' : ''} ${warning ? 'common-control--warning' : ''} ${success ? 'common-control--success' : ''} ${fullWidth ? 'common-control--full-width' : ''} ${className}`.trim()}
        required={required}
        value={value}
        defaultValue={defaultValue}
        maxLength={characterLimit}
        aria-invalid={error || undefined}
        aria-describedby={descriptionIds}
        onChange={handleChange}
        {...props}
      />
    </FormField>
  )
})

export default Textarea