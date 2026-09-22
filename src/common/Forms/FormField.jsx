export function getDescriptionIds(id, error, errorMessage, helperText, warning, warningMessage, success, successMessage) {
  const ids = []

  if (error && errorMessage) ids.push(`${id}-error`)
  else if (warning && warningMessage) ids.push(`${id}-warning`)
  else if (success && successMessage) ids.push(`${id}-success`)
  else if (helperText) ids.push(`${id}-helper`)

  return ids.join(' ') || undefined
}

export default function FormField({
  id,
  label,
  required = false,
  error = false,
  errorMessage,
  warning = false,
  warningMessage,
  success = false,
  successMessage,
  helperText,
  counter,
  fullWidth = false,
  className = '',
  children,
}) {
  const state = error ? 'error' : warning ? 'warning' : success ? 'success' : ''
  const message = error && errorMessage ? errorMessage : warning && warningMessage ? warningMessage : success && successMessage ? successMessage : helperText
  const messageId = error && errorMessage ? `${id}-error` : warning && warningMessage ? `${id}-warning` : success && successMessage ? `${id}-success` : helperText ? `${id}-helper` : undefined

  return (
    <div className={`common-field ${fullWidth ? 'common-field--full-width' : ''} ${state ? `common-field--${state}` : ''} ${className}`.trim()}>
      {label ? (
        <label className="common-field__label" htmlFor={id}>
          {label}
          {required ? <span className="common-field__required" aria-hidden="true"> *</span> : null}
        </label>
      ) : null}
      {children}
      {message ? <p className={`common-field__message ${state ? `common-field__message--${state}` : ''}`.trim()} id={messageId}>{message}</p> : null}
      {counter ? <span className="common-field__counter">{counter}</span> : null}
    </div>
  )
}