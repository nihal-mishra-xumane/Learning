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
  API endpoints) as functional defaults. `src/common/Sidebar/Sidebar.jsx`'s
  `brand = 'planstudio'` default is an example of what NOT to do — defaults should
  be generic placeholders, not this product's name.
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

## Known gaps (check before assuming something exists)

- `src/common/Login/`, `src/common/Theme/`, `src/common/Tables/` are currently
  empty placeholders — components not built yet, referenced in the nav but with
  no implementation.
- `src/common/DataTable.jsx` has no CSS anywhere in the repo; it renders unstyled
  until that's added.
- There is no shared design-token/theme file; component CSS files each hardcode
  their own colors independently.
