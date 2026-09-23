import { forwardRef } from 'react'

/**
 * The one button in the system. Variants and sizes map to token-driven classes,
 * so a button never carries its own colours.
 *
 * `loading` keeps the button's width and marks it `aria-busy`, so the layout
 * does not jump and assistive tech is told something is in progress.
 */
const Button = forwardRef(function Button(
  {
    children,
    variant = 'secondary',
    size = 'md',
    type = 'button',
    loading = false,
    disabled = false,
    fullWidth = false,
    iconOnly = false,
    startIcon: StartIcon,
    endIcon: EndIcon,
    className = '',
    ...rest
  },
  ref,
) {
  const classes = [
    'ui-btn',
    `ui-btn-${variant}`,
    size !== 'md' ? `ui-btn-${size}` : '',
    fullWidth ? 'ui-btn-block' : '',
    iconOnly ? 'ui-btn-icon' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      ref={ref}
      type={type}
      className={classes}
      // Disabling while busy stops double submits without removing the button
      // from the tab order unexpectedly.
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? <span className="ui-spinner" aria-hidden="true" /> : null}
      {StartIcon ? <StartIcon size={16} aria-hidden="true" /> : null}
      {children}
      {EndIcon ? <EndIcon size={16} aria-hidden="true" /> : null}
    </button>
  )
})

export default Button
