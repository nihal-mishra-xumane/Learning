import { CheckCircle2, CircleAlert, Info, TriangleAlert, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import './Notification.css'

const notificationTypes = ['success', 'error', 'warning', 'info']

export default function Notification({
  type = 'info',
  message,
  title,
  description,
  icon,
  actions = [],
  theme = 'light',
  duration = 4000,
  onClose,
  position = 'top-right',
}) {
  const resolvedType = notificationTypes.includes(type) ? type : 'info'
  const resolvedTheme = theme === 'dark' ? 'dark' : 'light'
  const [isVisible, setIsVisible] = useState(true)

  const defaultIcons = {
    success: <CheckCircle2 size={20} aria-hidden="true" />,
    error: <CircleAlert size={20} aria-hidden="true" />,
    warning: <TriangleAlert size={20} aria-hidden="true" />,
    info: <Info size={20} aria-hidden="true" />,
  }

  const dismiss = () => {
    setIsVisible(false)
    onClose?.()
  }

  useEffect(() => {
    setIsVisible(true)
    if (!duration) return undefined

    const timer = window.setTimeout(dismiss, duration)
    return () => window.clearTimeout(timer)
  }, [duration, message, type])

  if (!isVisible) return null

  return (
    <div
      className={`notification notification--${resolvedType} notification--${position} notification--${resolvedTheme}`}
      role={resolvedType === 'error' ? 'alert' : 'status'}
      aria-live={resolvedType === 'error' ? 'assertive' : 'polite'}
    >
      <div className="notification__icon" aria-hidden="true">{icon || defaultIcons[resolvedType]}</div>
      <div className="notification__content">
        {title && <strong className="notification__title">{title}</strong>}
        {description ? <p className="notification__description">{description}</p> : <p className="notification__message">{message}</p>}
        {actions.length > 0 && (
          <div className="notification__actions">
            {actions.map((action) => (
              <button key={action.id || action.label} type="button" className={`notification__action notification__action--${action.variant || 'secondary'}`} onClick={() => action.onClick?.(dismiss)}>
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <button type="button" className="notification__close" aria-label="Dismiss notification" onClick={dismiss}>
        <X size={17} aria-hidden="true" />
      </button>
    </div>
  )
}
