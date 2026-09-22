import { useState } from 'react'
import { Bell } from 'lucide-react'
import Notification, { NotificationPanel } from '../../common/Notifications'
import './Notifications.css'

const notificationExamples = [
  { type: 'success', label: 'Success', message: 'The action completed successfully.' },
  { type: 'error', label: 'Error', message: 'Something went wrong. Please try again.' },
  { type: 'warning', label: 'Warning', message: 'Please review the information before continuing.' },
  { type: 'info', label: 'Info', message: 'New information is available.' },
]

export default function NotificationsPage() {
  const [notification, setNotification] = useState(null)
  const [panelOpen, setPanelOpen] = useState(false)
  const [panelNotifications, setPanelNotifications] = useState([
    { id: 'pixelwave', name: 'Pixelwave', summary: 'Commented on Classic Car in Studio', preview: 'These draggable sliders look amazing.', time: '2 min ago' },
    { id: 'turtle', name: 'Cute Turtle is generated', summary: 'Matte texture - UI Style', preview: 'Prompt: Create 3D character with a friendly expression.', time: '18 min ago' },
    { id: 'object', name: '3D object is generated', summary: 'Invited you to edit a project', time: '42 min ago', actions: [{ id: 'decline', label: 'Decline', variant: 'secondary' }, { id: 'accept', label: 'Accept', variant: 'primary' }] },
    { id: 'luna', name: 'Luna', summary: 'Liked Classic Car in Studio', time: '1 hr ago', read: true },
    { id: 'comment', name: '3D object is generated', summary: 'Commented on Classic Car in Studio', time: '2 hrs ago', read: true },
  ])

  const showNotification = (example, duration = 0) => {
    setNotification({ ...example, duration })
  }

  const showDownloadToast = (theme) => {
    setNotification({
      type: 'success',
      theme,
      title: 'Untitled_UI_logos.zip downloaded!',
      description: 'Please follow our logo guidelines.',
      actions: [
        { id: 'dismiss', label: 'Dismiss', onClick: (dismiss) => dismiss() },
        { id: 'view', label: 'View in Finder', variant: 'primary', onClick: () => setNotification(null) },
      ],
      duration: 0,
    })
  }

  const markAllRead = () => {
    setPanelNotifications((currentNotifications) => currentNotifications.map((item) => ({ ...item, read: true })))
  }

  return (
    <div className="demo-page demo-page--notifications">
      <div className="page-heading">
        <p className="eyebrow">Common / Notifications</p>
        <h1>Notifications</h1>
        <p>Short, accessible feedback that can be dismissed manually or automatically.</p>
      </div>

      <section className="component-section" aria-labelledby="notification-examples-heading">
        <div className="section-heading">
          <h2 id="notification-examples-heading">Examples</h2>
          <p>Choose a type and message in the page, then pass them to the generic component.</p>
        </div>
        <div className="demo-actions">
          {notificationExamples.map((example) => (
            <button key={example.type} type="button" onClick={() => showNotification(example)}>
              {example.label}
            </button>
          ))}
          <button type="button" onClick={() => showNotification({ type: 'success', message: 'This notification dismisses automatically.' }, 3000)}>
            Auto-dismiss
          </button>
          <button type="button" onClick={() => showDownloadToast('light')}>Light toast</button>
          <button type="button" onClick={() => showDownloadToast('dark')}>Dark toast</button>
        </div>
      </section>

      <section className="component-section" aria-labelledby="notification-panel-heading">
        <div className="section-heading">
          <h2 id="notification-panel-heading">Notification panel</h2>
          <p>A reusable dropdown panel for activity, comments, invitations, and other user notifications.</p>
        </div>
        <div className="notification-panel-demo">
          <div className="notification-panel-demo__anchor">
            <button type="button" className="notification-bell" aria-expanded={panelOpen} aria-controls="notification-panel" onClick={() => setPanelOpen((isOpen) => !isOpen)}>
              <Bell size={20} aria-hidden="true" />
              <span>Notifications</span>
              {panelNotifications.some((item) => !item.read) && <b>{panelNotifications.filter((item) => !item.read).length}</b>}
            </button>
            <NotificationPanel
              open={panelOpen}
              id="notification-panel"
              notifications={panelNotifications}
              onClose={() => setPanelOpen(false)}
              onMarkAllRead={markAllRead}
              onNotificationClick={(item) => setPanelNotifications((currentNotifications) => currentNotifications.map((notificationItem) => notificationItem.id === item.id ? { ...notificationItem, read: true } : notificationItem))}
            />
          </div>
        </div>
      </section>

      <section className="component-section" aria-labelledby="notification-usage-heading">
        <div className="section-heading">
          <h2 id="notification-usage-heading">Usage</h2>
          <p><code>type</code> controls semantic styling, <code>message</code> supplies the content, <code>duration</code> controls auto-dismiss, and <code>onClose</code> handles manual dismissal.</p>
        </div>
      </section>

      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          title={notification.title}
          description={notification.description}
          actions={notification.actions}
          theme={notification.theme}
          duration={notification.duration}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  )
}
