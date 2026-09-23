import { forwardRef } from 'react'

/**
 * On/off toggle.
 *
 * A `<button role="switch">` rather than a styled checkbox: it carries
 * `aria-checked`, responds to Space and Enter natively, and cannot be submitted
 * with a form by accident.
 *
 * Use it for settings that apply immediately. For anything that needs a Save
 * step, pair it with the page's own dirty state.
 */
const Switch = forwardRef(function Switch(
  { checked = false, onChange, disabled = false, label, describedBy, className = '', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      aria-describedby={describedBy}
      disabled={disabled}
      className={`ui-switch ${className}`.trim()}
      onClick={() => onChange?.(!checked)}
      {...rest}
    >
      <span className="ui-switch-thumb" aria-hidden="true" />
    </button>
  )
})

export default Switch
