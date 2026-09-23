# Common

Shared, app-agnostic code, meant to be copied wholesale into other
applications. Anything in here must work unchanged elsewhere: no business
rules, no API calls, no hardcoded labels, no imports from `src/pages`.

Before adding a component, check whether one here already does the job —
see the root `CLAUDE.md` for the full rule.

## Areas

- `Buttons/`, `Forms/`, `Header/`, `Sidebar/`, `Modals/`, `Notifications/`,
  `Tabs/`, `StatusBadges/`, `Filters/`, `Search/`, `DataTable.jsx` — the
  established controls, tabs, modals, notifications, status badges, buttons,
  forms, header and data table. Pages compose these from `src/pages`. All are
  exported from `src/common/index.js`.
- `theme/` — design tokens, the `ThemeProvider`, `ThemeToggle` and the shared
  `ui-` styles. See its README before adding any styling anywhere else.
- `components/` — presentational primitives built specifically against the
  `theme/` token system (`Button`, `ColorPicker`, `ErrorBoundary`,
  `FormField`, `RadioCardGroup`, `SegmentedControl`, `Select`, `Slider`,
  `Switch`). **Note:** this currently overlaps with `Buttons/` and `Forms/`
  above — see the "duplicate component families" note in the root
  `CLAUDE.md`, which needs a decision before more pages adopt one or the
  other.
- `hooks/` — shared behaviour. `useRovingRadio` holds the ARIA radiogroup
  keyboard pattern used by every single-choice control, so it exists once.
