# Common

Shared, app-agnostic code. Anything in here must work unchanged in both
Procurement and CRM: no business rules, no API calls, no hardcoded labels.

- `theme/` - design tokens, the ThemeProvider and the shared `ui-` styles. See
  its README before adding any styling anywhere else.
- `components/` - reusable presentational components. They take props and emit
  callbacks; data fetching stays in the page that uses them.
  `Button`, `ColorPicker`, `ErrorBoundary`, `FormField`, `RadioCardGroup`,
  `SegmentedControl`, `Select`, `Slider`, `Switch`.
- `hooks/` - shared behaviour. `useRovingRadio` holds the ARIA radiogroup
  keyboard pattern used by every single-choice control, so it exists once.

Before adding a component, check whether one here already does the job.
