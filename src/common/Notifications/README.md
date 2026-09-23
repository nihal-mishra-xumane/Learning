# Notifications

`Notification` is a single toast-style alert (success/error/warning/info)
meant to be rendered at a fixed screen position, with an icon, title/message,
optional action buttons, and auto-dismiss. `NotificationPanel` is a
dropdown/inbox-style panel that lists multiple notification items with
read/unread state, per-item actions, and a "mark all read" action. Use
`Notification` for transient feedback (e.g. "Changes saved"); use
`NotificationPanel` for a persistent notifications inbox, typically opened
from a bell icon.

## Usage

```jsx
import { Notification, NotificationPanel } from '../../common'

// Toast
<Notification
  type="success"
  title="Changes saved"
  description="Your updates were successfully published."
  onClose={() => setToast(null)}
  actions={[{ id: 'view', label: 'View', variant: 'primary', onClick: () => navigate('/updates') }]}
/>

// Inbox panel
<NotificationPanel
  open={panelOpen}
  notifications={notifications}
  onClose={() => setPanelOpen(false)}
  onMarkAllRead={markAllAsRead}
  onNotificationClick={(notification) => openDetails(notification)}
/>
```

## Notification props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `'success' \| 'error' \| 'warning' \| 'info'` | `'info'` | Semantic type; invalid values fall back to `'info'`. Also sets `role`/`aria-live` (`alert`/`assertive` for `error`, otherwise `status`/`polite`). |
| `message` | node | — | Short message. Rendered only when `description` is not provided. |
| `title` | string | — | Optional heading above the message. |
| `description` | string | — | Longer text; rendered instead of `message` when provided. |
| `icon` | node | built-in icon for `type` | Custom icon override. |
| `actions` | array | `[]` | Action buttons: `{ id, label, variant, onClick(dismiss) }`. |
| `theme` | `'light' \| 'dark'` | `'light'` | Visual theme. |
| `duration` | number | `4000` | Auto-dismiss delay in ms. `0` disables auto-dismiss. |
| `onClose` | function | — | Called when the notification is dismissed (auto or manual). |
| `position` | `'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left'` | `'top-right'` | Fixed-position placement on screen. |

## NotificationPanel props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | boolean | `false` | Controls visibility (component renders `null` when closed). |
| `notifications` | array | `[]` | Items: `{ id, name, summary, preview, time, dateTime, avatar, read, actions }`. |
| `onClose` | function | — | Called on Escape, an outside click, or the close button. |
| `onMarkAllRead` | function | — | Called from the header action and the footer action. |
| `onNotificationClick` | function | — | Called with the clicked item. When provided, items become keyboard-focusable (Enter/Space activates them); when omitted, items are not interactive. |
| `title` | string | `'Notifications'` | Panel heading. |
| `markAllLabel` | string | `'All read'` | Label for the header "mark all read" action. |
| `emptyMessage` | string | `'You are all caught up.'` | Shown when `notifications` is empty. |
| `id` | string | `'notification-panel'` | `id` attribute on the root `<section>`. |

**Notes:**
- `NotificationPanel` closes on `Escape` and on any pointer-down outside the
  panel — it does not manage its own toggle button, so wire `open` to
  whatever triggers it (e.g. a bell icon in `Header`).
- The unread count is derived from `notifications.filter(n => !n.read).length`.
- Each notification item can carry its own `actions` array, rendered inline
  and independent of the panel-level `onNotificationClick`.
