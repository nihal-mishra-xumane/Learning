import { Eye, EyeOff, X } from 'lucide-react'
import { forwardRef, useId, useState } from 'react'
import FormField, { getDescriptionIds } from './FormField'

const Input = forwardRef(function Input(
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
    prefix,
    suffix,
    leftIcon,
    rightIcon,
    clearable = false,
    onClear,
    showPasswordToggle = false,
    characterLimit,
    showCounter = false,
    className = '',
    required = false,
    name,
    type = 'text',
    value,
    defaultValue,
    onChange,
    ...props
  },
  ref,
) {
  const generatedId = useId()
  const inputId = id || `input-${generatedId}`
  const [showPassword, setShowPassword] = useState(false)
  const [internalValue, setInternalValue] = useState(defaultValue || '')
  const isControlled = value !== undefined
  const currentValue = isControlled ? value : internalValue
  const inputType = showPassword && type === 'password' ? 'text' : type
  const descriptionIds = getDescriptionIds(inputId, error, errorMessage, helperText, warning, warningMessage, success, successMessage)
  const counter = showCounter || characterLimit ? `${String(currentValue || '').length}${characterLimit ? `/${characterLimit}` : ''}` : null
  const handleChange = (event) => {
    if (!isControlled) setInternalValue(event.target.value)
    onChange?.(event)
  }
  const handleClear = () => {
    if (!isControlled) setInternalValue('')
    onClear?.()
    if (!onClear && onChange) onChange({ target: { value: '' }, currentTarget: { value: '' } })
  }

  return (
    <FormField id={inputId} label={label} required={required} error={error} errorMessage={errorMessage} warning={warning} warningMessage={warningMessage} success={success} successMessage={successMessage} helperText={helperText} counter={counter} fullWidth={fullWidth}>
      <div className={`common-input common-input--${size} ${fullWidth ? 'common-control--full-width' : ''}`}>
        {prefix ? <span className="common-input__affix">{prefix}</span> : null}
        {leftIcon ? <span className="common-input__icon" aria-hidden="true">{leftIcon}</span> : null}
        <input
          ref={ref}
          id={inputId}
          name={name}
          type={inputType}
          value={value}
          defaultValue={defaultValue}
          maxLength={characterLimit}
          className={`common-control ${error ? 'common-control--error' : ''} ${warning ? 'common-control--warning' : ''} ${success ? 'common-control--success' : ''} ${leftIcon ? 'common-control--has-left-icon' : ''} ${rightIcon || clearable || (showPasswordToggle && type === 'password') ? 'common-control--has-right-icon' : ''} ${className}`.trim()}
          required={required}
          aria-invalid={error || undefined}
          aria-describedby={descriptionIds}
          onChange={handleChange}
          {...props}
        />
        {clearable && currentValue ? <button type="button" className="common-input__action" onClick={handleClear} aria-label={`Clear ${label || 'input'}`}><X size={16} /></button> : null}
        {showPasswordToggle && type === 'password' ? <button type="button" className="common-input__action" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button> : null}
        {rightIcon && !clearable && !(showPasswordToggle && type === 'password') ? <span className="common-input__icon common-input__icon--right" aria-hidden="true">{rightIcon}</span> : null}
        {suffix ? <span className="common-input__affix">{suffix}</span> : null}
      </div>
    </FormField>
  )
})

export default Input