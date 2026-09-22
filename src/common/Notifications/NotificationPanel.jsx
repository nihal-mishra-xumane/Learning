import { useEffect, useRef } from 'react'
import { Bell, CheckCheck, MoreHorizontal, X } from 'lucide-react'
import './NotificationPanel.css'

export default function NotificationPanel({
  open = false,
  notifications = [],
  onClose,
  onMarkAllRead,
  onNotificationClick,
  title = 'Notifications',
  markAllLabel = 'All read',
  emptyMessage = 'You are all caught up.',
  id = 'notification-panel',
}) {
  const panelRef = useRef(null)
  const unreadCount = notifications.filter((notification) => !notification.read).length

  useEffect(() => {
    if (!open) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.()
    }

    const handlePointerDown = (event) => {
      if (!panelRef.current?.contains(event.target)) onClose?.()
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('pointerdown', handlePointerDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [onClose, open])

  if (!open) return null

  return (
    <section ref={panelRef} id={id} className="notification-panel" aria-label={title}>
      <header className="notification-panel__header">
        <div>
          <span className="notification-panel__eyebrow">Inbox</span>
          <h2>{title}</h2>
        </div>
        <button type="button" className="notification-panel__header-action" onClick={onMarkAllRead} disabled={!unreadCount}>
          <CheckCheck size={15} aria-hidden="true" />
          <span>{markAllLabel}</span>
        </button>
        <button type="button" className="notification-panel__close" onClick={onClose} aria-label="Close notifications">
          <X size={18} aria-hidden="true" />
        </button>
      </header>

      <div className="notification-panel__list" role="list">
        {notifications.length ? notifications.map((notification) => (
          <article
            key={notification.id}
            role="listitem"
            className={`notification-panel__item${notification.read ? '' : ' notification-panel__item--unread'}`}
            onClick={() => onNotificationClick?.(notification)}
          >
            <div className="notification-panel__avatar" aria-hidden="true">
              {notification.avatar ? <img src={notification.avatar} alt="" /> : notification.name?.charAt(0) || <Bell size={16} />}
            </div>
            <div className="notification-panel__content">
              <div className="notification-panel__item-heading">
                <strong>{notification.name}</strong>
                {!notification.read && <span className="notification-panel__unread-dot" aria-label="Unread" />}
              </div>
              <p className="notification-panel__summary">{notification.summary}</p>
              {notification.preview && <p className="notification-panel__preview">{notification.preview}</p>}
              <time className="notification-panel__time" dateTime={notification.dateTime}>{notification.time}</time>
              {notification.actions?.length > 0 && (
                <div className="notification-panel__actions">
                  {notification.actions.map((action) => (
                    <button key={action.id} type="button" className={`notification-panel__action notification-panel__action--${action.variant || 'secondary'}`} onClick={(event) => { event.stopPropagation(); action.onClick?.(notification) }}>
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button type="button" className="notification-panel__more" aria-label={`More options for ${notification.name}`} onClick={(event) => event.stopPropagation()}>
              <MoreHorizontal size={17} aria-hidden="true" />
            </button>
          </article>
        )) : <p className="notification-panel__empty">{emptyMessage}</p>}
      </div>

      <footer className="notification-panel__footer">
        <span>{unreadCount ? `${unreadCount} unread` : 'All notifications read'}</span>
        <button type="button" onClick={onMarkAllRead} disabled={!unreadCount}>Mark all as read</button>
      </footer>
    </section>
  )
}
