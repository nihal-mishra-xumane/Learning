# crm-learning

React 18 + Vite single-page app. `src/common/` is a portable UI component library
that gets copied into other applications — treat it as a standalone package that
happens to live inside this repo, not as app-specific code.

## Rule: always use `src/common` components

Never hand-write markup for something `src/common` already provides (buttons,
inputs, headers, sidebars, modals, notifications, tabs, status badges, filters,
search, tables). Import it instead:

```js
import { Button, Header, Sidebar, Modal } from '../../common'
```

If a control doesn't exist yet in `src/common`, add it there first, export it from
`src/common/index.js`, and consume it from the page — don't build a one-off version
inside `src/pages/**`. Pages exist only to demo/compose common components with
sample data; they should not contain their own styled form/nav/table primitives.

Before adding a new common component, check `src/common/index.js` and the relevant
`src/common/<Feature>/` folder first — it may already exist under a name you didn't
expect.

## Working in `src/common/`

Because this folder is meant to be copy-pasted into other apps, every component in
it must stay self-contained:

- **No imports from outside `src/common/`.** No app state, no app routing, no
  `src/pages/**` imports. If a component needs data, it comes in through props.
- **No hardcoded app-specific values** (brand names, product copy, real user data,
  API endpoints) as functional defaults. `src/common/Sidebar/Sidebar.jsx` used to
  default `brand` to `'planstudio'` (and hardcode its brand-mark icon to the
  letter "p", derived from that same name) — both now fixed to generic
  fallbacks. That's the shape of mistake to avoid: check every literal you add
  to a common component for whether it's really generic.
- **Match the component's actual prop API.** Check the component's source (or its
  README, e.g. `src/common/Header/README.md`) before wiring it up — don't guess
  prop names. `src/pages/Sidebar/SidebarPage.jsx` previously called `<Header>` with
  a prop shape from an old, unrelated design and silently rendered the wrong thing;
  nothing caught it because there's no TypeScript/PropTypes in this repo, so review
  prop usage manually.
- **File name casing must match imports exactly.** This repo runs on Windows,
  which is case-insensitive, so `import Header from './Header/Header'` will resolve
  locally even though the real file is `header.jsx`. It will break the moment this
  folder is copied to a case-sensitive filesystem (Linux/macOS/CI). Always match
  case exactly.
- **Every component must be exported from `src/common/index.js`.** If you add a
  new component or a new folder under `src/common/`, add its export to the root
  barrel in the same change — don't leave it reachable only via a deep import path.
- **Prefix CSS classes with the component name** (e.g. `app-header__*`,
  `sidebar-*`, `modal__*`) so styles don't collide with a host app's global
  classes after copying. Don't add unprefixed generic class names like
  `pagination` or `icon-button`.

## ⚠️ Unresolved: two competing component sets (pick one before adding more)

`src/common/theme/` (a `ThemeProvider` + design-token system) was merged in
from a separate branch. It ships with its own `src/common/components/`
folder containing `Button`, `Select`, `Switch`, and `Slider` — which
**duplicate** `src/common/Buttons/Button.jsx`, `src/common/Forms/Select.jsx`,
and `src/common/Forms/Switch.jsx`. This is exactly the duplication this file
tells you not to create, and it exists only because it hasn't been reconciled
yet:

- `src/common/components/*` are styled entirely through the new token/CSS-variable
  system (`ui-btn`, `ui-select`, …) — only these respond live to the Theme page's
  color/typography controls.
- `src/common/Buttons/*` and `src/common/Forms/*` use hardcoded hex colors per
  component and do **not** react to theme changes.
- `src/pages/Theme/ThemeConfigPage.jsx` and `ThemePreview.jsx` depend on the
  `src/common/components/*` versions specifically, for that reason.

**Do not silently pick one when adding a new page.** Check which family the
rest of that page/feature already uses and stay consistent, or ask. Migrating
everything onto the token-driven set (retiring `Buttons/`/`Forms/`'s
duplicated pieces) is the likely long-term direction, but is a deliberate,
separate piece of work — not something to do incidentally while building
something else.
