# Theme

Centralised design tokens for the app. Shared by Procurement and CRM: same
typography, spacing, radii, icons and states, only the configuration differs.

## Setup

Mount the provider once, at the root. Everything below it is themed.

```jsx
import { ThemeProvider } from './common/theme'

<ThemeProvider defaultMode="system" defaultDensity="comfortable">
  <App />
</ThemeProvider>
```

`index.html` carries a small pre-paint script that applies the stored mode
before React boots, so dark-mode users never get a white flash. If you change
`storageKey`, change it there too.

## Using tokens

In CSS, always a variable - never a literal:

```css
.panel {
  padding: var(--ui-space-6);
  border-radius: var(--ui-radius-lg);
  background: var(--ui-color-bg-surface);
  color: var(--ui-color-text-primary);
  box-shadow: var(--ui-shadow-sm);
}
```

In JS, only when a value has to be computed:

```jsx
const { theme, isDark, mode, setMode, toggleMode, density, setDensity } = useTheme()
```

Variable names mirror the token path: `color.bg.surface` becomes
`--ui-color-bg-surface`, `space.6` becomes `--ui-space-6`. Inspect `<html>` in
dev tools for the full list as it stands at runtime.

## Contrast

Text colours are computed, not chosen. `buildColors` measures candidate inks
against the actual surface, so a dark theme always gets light type and a light
theme dark type, and `onSolid` / `softText` are derived per intent. Swap the
brand ramp for a pale yellow and button labels flip to dark ink on their own.

`contrast.js` exposes the maths if you need it directly: `contrastRatio`,
`meetsContrast`, `readableTextOn`, `ensureContrast`.

## Re-theming

```js
import { createTheme } from './common/theme'

export const crmTheme = createTheme({
  name: 'crm',
  palette: { brand: { 500: '#a78bfa', 600: '#7c3aed', 700: '#6d28d9' } },
  typography: { family: { sans: "'Roboto', system-ui, sans-serif" } },
})
```

Pass it as `<ThemeProvider config={crmTheme}>`. Overrides are deep-merged onto
the defaults, so you only state what differs. No component changes.

## Runtime settings

`config` is what the app ships with. `settings` is what a user can change from
the Theme Config page - a flat, JSON-safe object, so it can be persisted,
exported, or stored against a user profile.

```jsx
const { settings, updateSettings, saveSettings, cancelChanges, resetSettings, isDirty } = useTheme()

updateSettings({ primaryColor: '#7c3aed' }) // live across the whole app
saveSettings()                              // commit + persist
```

The provider keeps a **draft** and a **saved** copy. Everything renders from the
draft, which is what makes the live preview free: change a control and the real
sidebar, header and tables update with it. Nothing is written to storage until
`saveSettings()`.

Every read goes through `normalizeSettings`, which clamps and validates each
field, so a corrupt storage entry or a hand-edited import file falls back to the
defaults instead of breaking the screen.

Settings that CSS has to branch on (button style, sidebar position, mode,
density) are also written as `data-` attributes on `<html>`, because a custom
property cannot switch a rule on or off.

## Density

`comfortable` (default) for forms and detail screens, `compact` for line-item
tables, `spacious` where there is room. It drives control heights, horizontal
padding, table row padding and section gaps - so a table does not need its own
sizing rules.

## Files

| File | Purpose |
| --- | --- |
| `tokens.js` | Single source of truth: palette, scales, semantic colours, `defaultSettings`, `normalizeSettings`, `createTheme`, `resolveTheme` |
| `contrast.js` | WCAG colour maths - luminance, ratios, readable-ink selection |
| `cssVariables.js` | Flattens the token object into CSS custom properties |
| `ThemeProvider.jsx` | Applies tokens to the document, handles mode/density/persistence |
| `ThemeToggle.jsx` | Accessible light / system / dark switcher |
| `theme.css` | Reset, base styles and the shared `ui-` component classes |

## Conventions

- No hex codes, px values, font sizes or shadows outside `tokens.js`.
- New shared styling goes in `theme.css` as a `ui-` class, not into a page.
- Validation state is expressed with `aria-invalid`, which is also what the
  error styling keys off - the visual and the accessible state cannot drift.
- Loading buttons use `aria-busy="true"` and keep their width.
