import { forwardRef, useId, useState } from 'react'
import FormField, { getDescriptionIds } from './FormField'

const RangeSlider = forwardRef(function RangeSlider(
  {
    id,
    label,
    min = 0,
    max = 100,
    step = 1,
    value,
    defaultValue = 50,
    onChange,
    error = false,
    errorMessage,
    warning = false,
    warningMessage,
    success = false,
    successMessage,
    helperText,
    showValue = true,
    className = '',
    required = false,
    ...props
  },
  ref,
) {
  const generatedId = useId()
  const sliderId = id || `range-${generatedId}`
  const [internalValue, setInternalValue] = useState(defaultValue)
  const isControlled = value !== undefined
  const currentValue = isControlled ? value : internalValue
  const descriptionIds = getDescriptionIds(sliderId, error, errorMessage, helperText, warning, warningMessage, success, successMessage)
  const handleChange = (event) => {
    if (!isControlled) setInternalValue(event.target.value)
    onChange?.(event)
  }

  return (
    <FormField id={sliderId} label={label} required={required} error={error} errorMessage={errorMessage} warning={warning} warningMessage={warningMessage} success={success} successMessage={successMessage} helperText={helperText} fullWidth>
      <div className={`common-range ${className}`.trim()}>
        <input ref={ref} id={sliderId} type="range" min={min} max={max} step={step} value={currentValue} onChange={handleChange} required={required} aria-invalid={error || undefined} aria-describedby={descriptionIds} {...props} />
        {showValue ? <output htmlFor={sliderId}>{currentValue}</output> : null}
      </div>
    </FormField>
  )
})

export default RangeSlider
