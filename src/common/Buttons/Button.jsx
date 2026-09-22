import { forwardRef } from 'react'
import './button.css'

const Button = forwardRef(function Button(
  {
    variant = 'primary',
    size = 'md',
    icon,
    iconPosition = 'left',
    leftIcon,
    rightIcon,
    loading = false,
    loadingText,
    disabled = false,
    fullWidth = false,
    rounded = false,
    square = false,
    badge = null,
    pressed,
    className = '',
    children,
    type = 'button',
    ...props
  },
  ref,
) {
  const isDisabled = disabled || loading
  const leadingIcon = leftIcon || (iconPosition === 'left' ? icon : null)
  const trailingIcon = rightIcon || (iconPosition === 'right' ? icon : null)
  const normalizedSize = { small: 'sm', medium: 'md', large: 'lg' }[size] || size
  const classNames = [
    'common-button',
    `common-button--${variant}`,
    `common-button--${normalizedSize}`,
    fullWidth ? 'common-button--full-width' : '',
    square || ((leadingIcon || trailingIcon) && !children) ? 'common-button--icon-only' : '',
    rounded ? 'common-button--rounded' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      ref={ref}
      type={type}
      className={classNames}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      aria-pressed={pressed === undefined ? undefined : pressed}
      {...props}
    >
      {loading ? <span className="common-button__spinner" aria-hidden="true" /> : null}
      {!loading && leadingIcon ? (
        <span className="common-button__icon" aria-hidden={children ? 'true' : undefined}>
          {leadingIcon}
        </span>
      ) : null}
      {loading ? loadingText || children : children}
      {!loading && trailingIcon ? (
        <span className="common-button__icon" aria-hidden={children ? 'true' : undefined}>
          {trailingIcon}
        </span>
      ) : null}
      {badge !== null && badge !== undefined ? <span className="common-button__badge">{badge}</span> : null}
    </button>
  )
})

export default Button