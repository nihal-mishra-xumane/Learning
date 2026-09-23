# Sidebar Navigation Component — Project Documentation

## Overview

A reusable, production-style **sidebar navigation system** built in React, with a companion demo page (`SidebarPage.jsx`) that wires it up with real data. The component supports nested menus, role/permission-based visibility, collapse-to-icons mode, mobile slide-in behavior, light/dark theming, and route-aware active-state highlighting.

This is a **generic, drop-in navigation component** — not tied to any specific app's data. Any app can feed it a menu tree and get a fully working sidebar.

---

## File Structure

```
common/Sidebar/
  ├── Sidebar.jsx       # the reusable component
  └── Sidebar.css       # its styling (theme-aware, responsive)

pages/.../
  └── SidebarPage.jsx   # example host page: defines menu data, wires state
```

---

## What's Built So Far

### 1. Core Sidebar component (`Sidebar.jsx`)

A single component (`<Sidebar />`) that renders:

- A **header** with a brand mark/name and a mobile close button
- A **section heading** showing the current workspace title and user role
- A **recursive navigation tree** (menu items can nest indefinitely)
- A **footer** with optional footer links and a user profile block
- A **collapse toggle** button (expand/minimize the whole sidebar)

### 2. Nested, permission-aware menu data

`SidebarPage.jsx` defines a realistic multi-level menu (`menuItems`):

```
Overview
Notifications
  ├── Mentions
  ├── Approvals
  ├── System updates
  └── Other
Workspace
  ├── Projects
  │     ├── Active projects
  │     └── Templates
  ├── Team (requires "team:read" permission)
  │     ├── Members (requires "team:read")
  │     └── Roles & access (requires "admin" role)
  └── Workflows
        ├── Automation
        └── Approvals
Reports
  ├── Performance
  └── Exports
        ├── Scheduled
        └── History
Content
  ├── Asset library
  └── Localization
Integrations
  ├── Connected apps
  └── Webhooks
Analytics (requires "admin" or "manager" role)
Alerts
Settings (requires "admin" role)
Help center
```

Each item can carry: `id`, `label`, `path`, `icon`, `badge`, `children`, `roles`, `permissions`.

### 3. Role & permission filtering

Implemented as three small pure functions at the top of `Sidebar.jsx`:

| Function | What it does |
|---|---|
| `canView(item, role, permissions)` | An item is visible if it has no `roles` restriction (or the current role is listed), **and** no `permissions` restriction (or the user has every required permission). |
| `hasVisibleItems(item, role, permissions)` | An item counts as visible if it's directly viewable, **or** at least one of its children is viewable — so a parent isn't hidden just because it's unrestricted while a child is restricted, or vice versa. |
| `filterItems(items, role, permissions)` | Recursively walks the whole tree and returns only the branches the current user is allowed to see. |

In the demo page, the sidebar is rendered with `role="manager"` and `permissions={['team:read']}` — so "Roles & access" (admin-only) and "Settings" (admin-only) are automatically hidden, while "Team → Members" (needs `team:read`) is shown.

### 4. Active-route awareness

- `activePath` is passed in from the parent and compared against each item's `path` to highlight the current page (`is-active` class, `aria-current="page"`).
- `hasActiveChild()` marks a **parent** item with a `has-active-child` style if one of its descendants is the active route — so users can tell which section they're in even when it's collapsed.
- A `useEffect` automatically expands every ancestor of the active item on load or when the route changes, using a `findParents` recursive search — so deep links land with the right menu branches already open.

### 5. Expand/collapse state for nested menus

- `expanded` is a `Set` of item IDs, toggled by `toggleExpanded(id)`.
- Clicking a parent item (one with `children`) toggles its expansion instead of navigating.
- Clicking a leaf item (no children) calls `onNavigate(item.path)` and, on mobile, closes the drawer via `onMobileClose()`.

### 6. Collapsed ("icon rail") mode

Controlled externally via the `collapsed` prop + `onCollapsedChange` callback (so the parent page owns the state — see `SidebarPage.jsx`'s `useState(false)`).

When collapsed:
- Labels, section heading, chevrons, and text are hidden (CSS `display: none` under `.is-collapsed`).
- Items become icon-only with `title` and `aria-label` set to the item's label (so the icon is still identifiable and accessible).
- Nested submenus become **hover/focus flyouts** positioned to the right of the rail (`.sidebar.is-collapsed .sidebar-submenu`), rather than disappearing.

### 7. Mobile responsive behavior

Controlled via `mobileOpen` + `onMobileClose`:
- Below `720px` (media query in `Sidebar.css`), the sidebar becomes a fixed, off-canvas drawer that slides in from the left (`transform: translateX`).
- A **backdrop** button appears behind it to close the drawer on outside click.
- A visible **close (X) button** appears in the header only on mobile.
- `SidebarPage.jsx` demonstrates the trigger: a "Menu" button that calls `setMobileOpen(true)`.

### 8. Light/dark theming

- All colors are CSS custom properties scoped to `.sidebar` (`--sidebar-ink`, `--sidebar-panel`, `--sidebar-accent`, etc.).
- A `[data-theme='light']` attribute selector overrides the full palette for light mode — no separate stylesheet needed.
- The `theme` prop sets `data-theme` on the root `<aside>`.
- `SidebarPage.jsx` wires a working toggle: a footer item labeled "Light theme"/"Dark theme" (icon switches between `Sun`/`Moon`) flips `theme` state on click.

### 9. Footer section: extra links + user profile

- `footerItems` renders a small secondary list above the profile block (Preferences, theme toggle, Sign out in the demo).
- `user` renders an avatar (initials or custom avatar), name, and role, plus a "more options" button (`onFooterNavigate`) for things like opening an account menu.

### 10. Notification badges

- `SidebarBadge` is a small subcomponent that renders a numeric pill (caps display at `99+`) next to a menu label, with an `aria-label` describing the count for screen readers.
- Parent items can show an aggregated badge (e.g. "Notifications" shows the sum of all sub-category counts — computed in `SidebarPage.jsx` via `notificationCategories.reduce(...)`).

### 11. Routing integration (in the demo page)

`SidebarPage.jsx` shows how to wire the sidebar to real browser navigation without a router library:
- `navigate(path)` calls `window.history.pushState` and updates `activePath` state.
- A `popstate` listener keeps `activePath` in sync with back/forward browser navigation.
- `findActiveLabel()` recursively searches the menu tree for the label matching the current path, used to show a page heading.

### 12. Accessibility details already in place

- `aria-current="page"` on the active item.
- `aria-expanded` on parent items that have children.
- `aria-label` / `title` fallbacks when labels are visually hidden (collapsed mode).
- `aria-hidden="true"` on decorative icons.
- The mobile backdrop and close button both have descriptive `aria-label`s.

---

## Props Reference (`Sidebar.jsx`)

| Prop | Type | Default | Purpose |
|---|---|---|---|
| `items` | array | `[]` | The menu tree to render |
| `activePath` | string | — | Current route, used for highlighting |
| `onNavigate` | function | — | Called with a path when a leaf item is clicked |
| `title` | string | `'Workspace'` | Section heading text |
| `brand` | string | `'planstudio'` | Brand name shown in the header |
| `role` | string | `'user'` | Current user's role, used for filtering |
| `permissions` | array | `[]` | Current user's permissions, used for filtering |
| `collapsed` | bool | `false` | Icon-only rail mode |
| `onCollapsedChange` | function | — | Called when the collapse toggle is clicked |
| `mobileOpen` | bool | `false` | Whether the mobile drawer is open |
| `onMobileClose` | function | — | Called to close the mobile drawer |
| `user` | object | — | `{ name, role, avatar/initials }` for the footer profile |
| `footerItems` | array | `[]` | Secondary footer links |
| `onFooterNavigate` | function | — | Called for footer items without a `path` (e.g. theme toggle, sign out) |
| `theme` | string | `'dark'` | `'dark'` or `'light'` |
| `showBrand` | bool | `true` | Whether to show the brand mark/name in the header |

**Menu item shape:**
```js
{
  id: 'string',        // required, unique
  label: 'string',      // required, display text
  path: 'string',       // optional — omit for parent-only items
  icon: Component,       // optional, a lucide-react icon component
  badge: number,          // optional, notification count
  children: [ ... ],       // optional, nested items (same shape)
  roles: ['admin'],         // optional, restricts visibility by role
  permissions: ['x:read'],   // optional, restricts visibility by permission
}
```

---

## Current Status

Fully functional and wired end-to-end in the demo page:
- ✅ Nested navigation with unlimited depth
- ✅ Role- and permission-based filtering
- ✅ Active route highlighting + auto-expand ancestors
- ✅ Collapsible rail mode with flyout submenus
- ✅ Mobile drawer with backdrop
- ✅ Light/dark theme toggle
- ✅ Notification badges (item-level and aggregated)
- ✅ Footer links + user profile block
- ✅ Basic accessibility (ARIA attributes, keyboard-reachable buttons)

## Possible Next Steps

- Keyboard navigation between items (arrow keys) for full a11y compliance
- Persist `collapsed`/`theme` state to localStorage so it survives reloads
- Swap the manual `pushState`/`popstate` wiring for a real router (React Router) if the app grows beyond a demo
- Extract `SidebarBadge` and the collapse/expand logic into their own files if the component keeps growing
