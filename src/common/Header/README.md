# Header

Application top bar: brand/logo, optional custom content (search box, theme
toggle, …), a notifications bell with unread badge, and a profile menu with
a details panel and logout. Self-contained — copy `Header/` (both files) into
another project and it works unchanged.

## Usage

```jsx
import Header from '../../common/Header/header'

<Header
  appName="Procurement Portal"
  appLogo="PR"
  user={{ name: 'Rahul Sharma', email: 'rahul@company.com', role: 'HR Manager' }}
  profileFields={[
    { key: 'role', label: 'Role' },
    { key: 'email', label: 'Email address' },
  ]}
  notificationCount={unreadCount}
  onNotificationsClick={markAllRead}
  onProfileClick={openProfile}
  onLogout={handleLogout}
/>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `appName` | string | `"Application"` | Brand text. Also used to derive the logo initials when `appLogo` is empty. |
| `appLogo` | string | — | Short text (e.g. `"CA"`) or emoji shown in the logo mark. |
| `appSubtitle` | string | `""` | Optional line under the app name. |
| `user` | `{ name, email, initials, avatarUrl }` | `{}` | Person shown in the profile button/menu. |
| `profileFields` | `{ key, label }[]` | `[]` | Extra rows shown in the profile "details" panel, read from `user[key]`. |
| `notificationCount` | number | `0` | Unread count shown as a badge on the bell icon. |
| `notificationsLabel` | string | `"Notifications"` | Accessible label / tooltip for the bell button. |
| `showNotifications` / `showProfile` / `showUserName` / `showLogout` / `showProfileAction` | boolean | `true` | Toggle each piece of UI on/off. |
| `showMobileMenuButton` | boolean | `false` | Show a hamburger/close button (for pairing with a collapsible sidebar). |
| `mobileMenuOpen` | boolean | `false` | Controls the hamburger button's open/closed icon and `aria-expanded`. |
| `onMobileMenuToggle` | `(nextOpen: boolean) => void` | — | Called when the mobile menu button is clicked. |
| `onNotificationsClick` | `() => void` | — | Called when the bell is clicked. The bell is disabled if this isn't provided. |
| `onProfileClick` | `(user) => void` | — | Called when "Profile" is clicked inside the profile menu. |
| `onLogout` | `(user) => void` | — | Called when "Logout" is clicked. Header has no logout logic of its own. |
| `onLogoClick` | `() => void` | — | Called when the brand/logo is clicked. Brand button is disabled if omitted. |
| `isLoading` | boolean | `false` | Dims the header and marks it `aria-busy`. |
| `isLogoutLoading` | boolean | `false` | Shows a spinner on the logout button instead of the icon. |
| `disabled` | boolean | `false` | Disables all interactive controls. |
| `className` | string | `""` | Extra class appended to the root `<header>`. |
| `children` | node | — | Rendered between the brand and the right-hand actions (e.g. a search box or `ThemeToggle`). |

There is no `notifications` (list) prop and no per-notification `onNotificationClick` —
Header only shows a count and a single click handler for the bell. Pair it with
`common/Notifications/NotificationPanel` if you need a dropdown list.

## Copying into another project

1. Copy the whole `Header/` folder (`header.jsx` **and** `header.css` — the CSS
   is not optional, it holds all of the component's styling).
2. Keep the file name casing exactly as-is (`header.jsx`, lowercase). This repo
   runs on Windows, which is case-insensitive, so an import like
   `from './Header/Header'` (capital H) will work here but fail on a
   case-sensitive filesystem (Linux/macOS/most CI). Always import as
   `from './Header/header'`.
3. Pass `user`/`profileFields`/notification data from whatever your app's
   shape is — Header doesn't assume any particular user schema.
4. Provide `onLogout`; Header never implements sign-out itself (clearing
   tokens, redirecting, calling an API, etc. is the host app's job).
