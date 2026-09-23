# Sidebar

A self-contained, generic navigation sidebar: recursive nested menu, role/permission-based
item filtering, active-route highlighting with auto-expanding ancestors, a collapsible
icon-only rail mode with hover/focus flyout submenus, and an off-canvas mobile drawer.
All state (`collapsed`, `mobileOpen`, `theme`, active route) is owned by the host page and
passed in as props — the component itself holds no app data and makes no routing
assumptions. Use it any time a page needs primary app navigation instead of hand-rolling a
nav list.

## Usage

```jsx
import { useState } from 'react'
import { Home, Users, Settings } from 'lucide-react'
import { Sidebar } from '../../common'

const menuItems = [
  { id: 'overview', label: 'Overview', path: '/overview', icon: Home },
  {
    id: 'team', label: 'Team', icon: Users, children: [
      { id: 'members', label: 'Members', path: '/team/members', permissions: ['team:read'] },
    ],
  },
  { id: 'settings', label: 'Settings', path: '/settings', icon: Settings, roles: ['admin'] },
]

function AppShell() {
  const [activePath, setActivePath] = useState('/overview')
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <Sidebar
      items={menuItems}
      activePath={activePath}
      onNavigate={setActivePath}
      role="manager"
      permissions={['team:read']}
      collapsed={collapsed}
      onCollapsedChange={setCollapsed}
      mobileOpen={mobileOpen}
      onMobileClose={() => setMobileOpen(false)}
      brand="Acme"
      user={{ name: 'Jane Doe', role: 'Manager', initials: 'JD' }}
    />
  )
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | array | `[]` | Menu tree to render. See item shape below. |
| `activePath` | string | — | Current route; highlights the matching item and auto-expands its ancestors. |
| `onNavigate` | function | — | Called with `item.path` when a leaf item (or a footer item with a `path`) is clicked. |
| `title` | string | `'Workspace'` | Heading text shown above the menu. |
| `brand` | string | `'Brand'` | Brand name shown in the header when `showBrand` is true; its first letter is used as the mark icon. |
| `role` | string | `'user'` | Current user's role, checked against each item's `roles` restriction; also shown in the heading. |
| `permissions` | array | `[]` | Current user's permissions, checked against each item's `permissions` restriction. |
| `collapsed` | bool | `false` | Renders the icon-only rail mode (submenus become hover/focus flyouts). |
| `onCollapsedChange` | function | — | Called with the next `collapsed` value when the collapse toggle is clicked. |
| `mobileOpen` | bool | `false` | Shows the sidebar as a fixed, off-canvas drawer with a backdrop (below 720px by default). |
| `onMobileClose` | function | — | Called to close the mobile drawer (backdrop click, close button, or after navigating to a leaf item). |
| `user` | object | — | `{ name, role, avatar?, initials? }` rendered in the footer profile block. |
| `footerItems` | array | `[]` | Secondary items rendered above the profile block, same shape as `items` (`{ id, label, icon?, path? }`). |
| `onFooterNavigate` | function | — | Called for a footer item with no `path`, and for the profile block's "more options" button. |
| `theme` | string | `'dark'` | `'dark'` or `'light'`; sets `data-theme` on the root `<aside>`. |
| `showBrand` | bool | `true` | Whether to render the brand mark/name in the header. |

**Menu item shape** (`items` / `footerItems`, recursive via `children`):

```js
{
  id: 'string',              // required, unique
  label: 'string',           // required, display text
  path: 'string',            // optional — omit for a parent-only (non-navigating) item
  icon: Component,           // optional, a component reference, e.g. lucide-react icon
  badge: number,             // optional, notification count (capped at "99+")
  children: [ /* same shape */ ],
  roles: ['admin'],          // optional, item hidden unless `role` is in this list
  permissions: ['x:read'],   // optional, item hidden unless every permission is in `permissions`
}
```

## Notes

- A parent item is never hidden purely because it itself is unrestricted — it stays visible
  if at least one descendant passes the `roles`/`permissions` check, and vice versa.
- Clicking an item with `children` toggles its expansion instead of navigating; only leaf
  items call `onNavigate`.
- Theming is CSS-variable based (`--sidebar-ink`, `--sidebar-accent`, etc., scoped to
  `.sidebar`), overridden under `.sidebar[data-theme='light']` — no separate stylesheet
  needed, just set the `theme` prop.
- Copy both `Sidebar.jsx` and `Sidebar.css` together; the component has no other
  dependencies beyond `react` and `lucide-react`.
