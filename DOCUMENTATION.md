# Airtecture — UI Foundation

A themeable React UI foundation: one set of design tokens, one set of shared
components, and a Theme Configuration screen that lets an end user re-skin the
entire application at runtime.

It is built to be dropped into more than one product — the code refers to
"Procurement" and "CRM" as the two intended consumers — so everything under
`src/common/` is deliberately free of business rules, API calls and hardcoded
labels.

---

## Table of contents

1. [Quick start](#quick-start)
2. [Tech stack](#tech-stack)
3. [Directory map](#directory-map)
4. [The core idea](#the-core-idea)
5. [The theme layer](#the-theme-layer)
6. [Component library](#component-library)
7. [Hooks](#hooks)
8. [The Theme Configuration page](#the-theme-configuration-page)
9. [Accessibility](#accessibility)
10. [Reusing this in another app](#reusing-this-in-another-app)
11. [How to extend it](#how-to-extend-it)
12. [Conventions](#conventions)
13. [Known gaps and things to fix](#known-gaps-and-things-to-fix)

---

## Quick start

```bash
npm install
npm start      # or npm run dev — Vite dev server
npm run build  # production build to dist/
npm run preview
```

There is no test, lint or format script — see [Known gaps](#known-gaps-and-things-to-fix).

---

## Tech stack

| Package | Version | Role |
| --- | --- | --- |
| `react`, `react-dom` | `latest` | UI runtime. Hooks and context only — no class components except `ErrorBoundary`. |
| `vite` + `@vitejs/plugin-react` | `latest` | Dev server and build. Config is the two-line default in `vite.config.js`. |
| `lucide-react` | `latest` | Icon set. Icons are passed to components *as components* (`startIcon={Upload}`), never rendered inside them. |

That is the complete dependency list. No UI kit, no Tailwind, no CSS-in-JS, no
state library, no router, no test framework. `devDependencies` is empty.

---

## Directory map

```
index.html                 Pre-paint theme script + Vite entry
vite.config.js             React plugin, nothing else
src/
  main.jsx                 Mounts ThemeProvider > ErrorBoundary > App
  App.jsx                  App shell: header, page nav, content area
  styles.css               Shell layout only (header/sidebar/content), token-driven
  common/                  App-agnostic, reusable. No business logic lives here.
    theme/
      index.js             Public entry point — import from here, not the files
      tokens.js            Palette, scales, settings, createTheme, resolveTheme
      contrast.js          WCAG colour maths (zero dependencies)
      cssVariables.js      Token object -> CSS custom properties
      ThemeProvider.jsx    Context, draft/saved state, persistence, DOM application
      ThemeToggle.jsx      Drop-in light/system/dark switcher
      theme.css            Reset + all shared `ui-` component classes
      README.md            Theme-layer notes
    components/
      index.js             Barrel export
      Button.jsx  ColorPicker.jsx  ErrorBoundary.jsx  FormField.jsx
      RadioCardGroup.jsx  SegmentedControl.jsx  Select.jsx  Slider.jsx  Switch.jsx
    hooks/
      useRovingRadio.js    WAI-ARIA radiogroup keyboard pattern
    README.md
  pages/
    Theme/
      ThemeConfigPage.jsx  The theme editor screen
      ThemeConfigPage.css  Page-specific layout
      ThemePreview.jsx     Live preview panel
    Buttons/ Filters/ Forms/ Header/ Login/ Search/
    Sidebar/ StatusBadges/ Tables/ Tabs/        <- placeholders (.gitkeep only)
```

---

## The core idea

Nothing in this app contains a literal colour, font size, radius or shadow
outside `tokens.js`. Styling flows one way:

```
  user settings (18 flat, JSON-safe values)
        |
        v
  resolveTheme(config, { mode, settings })      tokens.js
        |   derives ramps, measures contrast, builds scales
        v
  nested token object  { color: { bg: { surface: '#fff' } }, ... }
        |
        v
  toCssVariables()                               cssVariables.js
        |   flattens + kebab-cases
        v
  --ui-color-bg-surface: #fff       written onto <html> by ThemeProvider
        |
        v
  .ui-card { background: var(--ui-color-bg-surface) }     theme.css
```

Two consequences worth understanding:

**A theme change is a browser repaint, not a React re-render.** The tokens are
written once onto `document.documentElement` as custom properties. Components
never hold colours in props or inline styles, so changing the primary colour
does not re-render the tree.

**Some choices cannot be expressed as a variable**, because a custom property
cannot switch a CSS rule on or off. Those are written as `data-` attributes on
`<html>` instead — `data-theme`, `data-density`, `data-button-style`,
`data-sidebar` — and CSS branches on them (e.g.
`:root[data-button-style='outlined'] .ui-btn-primary`).

### The pre-paint script

`index.html` contains the only literal colours in the project, plus an inline
script that runs *before* React boots. It reads the stored mode from
`localStorage`, sets `data-theme` and `color-scheme`, so a dark-mode user never
sees a white flash on load.

> Two things must stay in sync by hand: the storage key `'ui-theme'` (matches
> `ThemeProvider`'s `storageKey` prop) and the two hex values (they mirror
> `palette.neutral[50]` and `palette.neutral[950]`).

---

## The theme layer

### tokens.js — the single source of truth

| Export | What it is |
| --- | --- |
| `palette` | Seven 50–950 ramps: `brand`, `accent`, `neutral`, `success`, `warning`, `danger`, `info`. |
| `generateRamp(base)` | Builds a full 50–950 ramp from one colour by tinting toward white and shading toward black. The input becomes step **600**. |
| `fontStacks` | Five choices — `system`, `inter`, `roboto`, `georgia`, `mono`. Every stack ends in a system font, so nothing depends on a webfont downloading. |
| `typography` | Families, weights, line heights, letter spacings. |
| `buildFontSizes(base)` | Derives the whole `xs`–`4xl` scale from one base px value, output in `rem`. A base of `14` reproduces the default scale. |
| `spacing` | 4px grid, keys `0`–`12`. Keys are **steps, not pixels** — `space.5` is `16px`. |
| `buildRadius(base)` | Derives `none`/`xs`/`sm`/`md`/`lg`/`xl`/`pill`/`circle` from one corner value. `0` gives square corners throughout. |
| `density` | `compact` / `comfortable` / `spacious` — control heights, horizontal padding, row padding, section gaps. |
| `contentWidths` | `narrow` 1120px, `wide` 1440px, `full` 100%. |
| `size` | Icon sizes, 44px touch target (WCAG 2.5.5), sidebar/header sizes, field max width. |
| `motion` | Durations and easing curves. |
| `zIndex` | Named layers, `base` 0 through `toast` 700. |
| `breakpoint` | **JS only.** CSS custom properties cannot be used inside media queries, so breakpoints never become variables. |
| `defaultSettings` | The 18 runtime settings (below). Eight are currently exposed in the config page UI; all 18 are live in the token layer. |
| `SETTING_LIMITS` | Clamp ranges for the numeric settings. |
| `colorPresets` | Swatches offered by the colour pickers. |
| `sanitizeImageUrl` | Security boundary — see below. |
| `normalizeSettings` | Coerces any input into a valid settings object. |
| `createTheme` / `resolveTheme` | The per-app seam, and the resolver. |

### Config vs settings

Two distinct layers, and the distinction matters.

**`config`** is what the *product* ships with — brand ramps, scales, density
definitions. Set once per app, at the provider. Procurement and CRM each pass
their own.

```js
import { createTheme } from './common/theme'

export const crmTheme = createTheme({
  name: 'crm',
  palette: { brand: { 500: '#a78bfa', 600: '#7c3aed', 700: '#6d28d9' } },
  typography: { family: { sans: "'Roboto', system-ui, sans-serif" } },
})
```

Overrides are deep-merged onto the defaults, so you state only what differs.
No component changes.

**`settings`** is what a *user* can change at runtime from the Theme Config
page. Flat and JSON-safe on purpose — this is what gets persisted, exported
and imported. `null` means "derive it".

The **UI** column marks whether the config page currently exposes a control for
the setting. All 18 are live in the token layer either way.

| Setting | Default | Range / values | UI |
| --- | --- | --- | :-: |
| `mode` | `'system'` | `light` / `dark` / `system` | ✅ |
| `primaryColor` | `#2563eb` | any hex or `rgb()` | ✅ |
| `accentColor` | `#0d9488` | any hex or `rgb()` | ✅ |
| `fontFamily` | `'inter'` | key of `fontStacks` | ✅ |
| `fontSize` | `14` | 12–20 (px, drives the whole scale) | ✅ |
| `buttonStyle` | `'filled'` | `filled` / `outlined` | ✅ |
| `backgroundColor` | `null` | `null` = from the neutral ramp | ✅ |
| `surfaceColor` | `null` | `null` = from the neutral ramp | ✅ |
| `headingWeight` | `'600'` | `400` / `500` / `600` / `700` | — |
| `bodyWeight` | `'400'` | `300` / `400` / `500` | — |
| `buttonTextColor` | `null` | `null` = computed for contrast | — |
| `backgroundImage` | `''` | `https://` or `data:image/` only | — |
| `borderColor` | `null` | `null` = derived from the surface | — |
| `borderWidth` | `1` | 0–4 px | — |
| `radius` | `8` | 0–24 px | — |
| `density` | `'comfortable'` | `compact` / `comfortable` / `spacious` | — |
| `sidebarPosition` | `'left'` | `left` / `right` | — |
| `contentWidth` | `'wide'` | `narrow` / `wide` / `full` | — |

> The ten settings without a control still validate, still resolve and still
> drive their tokens at the default values. They can be set by importing a
> theme file, by passing `initialSettings`, or by calling `updateSettings`
> directly — they simply have no widget on the page. See
> [Known gaps](#known-gaps-and-things-to-fix).

**`normalizeSettings` runs on every read** — from `localStorage`, from an
imported file, from every `updateSettings` call. Numbers are clamped to
`SETTING_LIMITS`, enums fall back to their default, blank colours fall back.
A corrupted storage entry or a hand-edited import degrades to the defaults
instead of breaking the screen.

**`sanitizeImageUrl` is a security boundary, not a validator.** The background
image URL ends up inside a CSS `url()`. It accepts only `http(s)://` and
`data:image/`, then encodes the value so quotes, parens and backslashes cannot
break out of the declaration.

### resolveTheme — the pipeline

`resolveTheme(config, { mode, settings })` produces the flat token set the app
consumes. In order:

1. **Normalize** the settings.
2. **Swap ramps if needed.** A picked colour replaces the shipped ramp via
   `generateRamp`; an *untouched* one keeps the hand-tuned original, so the
   defaults are not thrown away for nothing.
3. **Build semantic colours** (`buildColors`) — see below.
4. **Build the scales** — font sizes from `fontSize`, radii from `radius`,
   sizing from the density block, content max width from `contentWidth`.
5. **Build shadows** (`buildShadows`). Dark surfaces swallow soft shadows, so
   dark mode gets a roughly 1.9x deeper stack. A focus ring ships as a token
   (`shadow.focus`) because a visible focus indicator is non-negotiable.

#### How colours are computed, not chosen

This is where the system earns its keep. `buildColors` never hand-picks a text
colour for a background:

- **Ink is measured.** `readableTextOn(surface, …)` compares the contrast of a
  light and a dark candidate against the *actual* surface. So "dark theme →
  light font" holds even for a custom surface colour the user typed in.
- **Derived shades are blends** of the surface and its ink (`blend(0.05)`,
  `blend(0.22)` …), so every hover, border and sunken panel stays in step with
  a custom background.
- **`softText` and `onSolid` are guaranteed**, not hoped for.
  `ensureContrast(colour, background, 4.5)` nudges a colour toward black or
  white in 20 steps until it clears the ratio. Pick pale yellow as your primary
  and the button label flips to dark ink on its own.

The resolved theme object:

```
name  mode  density  settings
color    bg / border / text / primary / secondary / status / button
font     family / weight / lineHeight / letterSpacing / size
background.image   space   radius   borderWidth   size   shadow
motion   zIndex   breakpoint
```

### contrast.js — colour maths

Zero dependencies on purpose: usable from plain JS, tests, and both apps.

| Function | Purpose |
| --- | --- |
| `parseColor` | Parses `#rgb`, `#rrggbb`, `#rrggbbaa`, `rgb()`, `rgba()`. |
| `rgbToHex`, `withAlpha`, `mix` | Conversion and blending. |
| `flatten` | Composites a translucent colour onto an opaque one so it can be measured. |
| `luminance` | WCAG relative luminance. |
| `contrastRatio` | 1 (identical) to 21 (black on white). |
| `meetsContrast(fg, bg, level, size)` | AA/AAA, normal/large thresholds. |
| `isDarkColor` | Luminance below 0.45. |
| `readableTextOn` | **The core rule** — returns whichever ink reads better. |
| `ensureContrast` | Nudges a colour until it clears a minimum ratio. |

### cssVariables.js — JS tokens to CSS custom properties

The naming rule is mechanical: the token path becomes the variable name.

```
color.bg.surface   ->  --ui-color-bg-surface
space.6            ->  --ui-space-6
font.size.2xl      ->  --ui-font-size-2xl
```

| Function | Purpose |
| --- | --- |
| `toCssVariables(theme, prefix)` | Flattens and kebab-cases the token tree. |
| `applyCssVariables(el, vars, prevKeys)` | Writes them, removing keys that disappeared. Returns the applied keys for the next cleanup. |
| `toCssText(theme, { selector })` | Serialises as a CSS rule — for SSR or a static export. |

`SKIP_KEYS` (`breakpoint`, `name`, `settings`, `mode`, `density`) are structural
metadata, not styling values, so they are never emitted.

Inspect `<html>` in dev tools to see the full live list.

### ThemeProvider

Mount once at the root. Everything below it is themed.

**Props**

| Prop | Default | Purpose |
| --- | --- | --- |
| `config` | `defaultThemeConfig` | The per-app theme config from `createTheme`. |
| `initialSettings` | — | Product defaults, merged under anything the user saved. |
| `onSave` | — | Called with the settings on `saveSettings()` — hook your API here. |
| `storageKey` | `'ui-theme'` | `localStorage` key. **Must match `index.html`.** |
| `prefix` | `'--ui'` | CSS custom property prefix. |
| `persist` | `true` | Set `false` to keep everything in memory. |
| `disableTransitionOnChange` | `true` | Suppresses the cross-fade during a token swap, so a theme change reads as instant rather than a slow smear. |

**The draft/saved model.** The provider holds two copies of the settings:

- `draft` — what is on screen right now. **Everything renders from the draft**,
  which is what makes the live preview free: move a control and the real
  header, sidebar and tables move with it.
- `saved` — what was last committed and persisted.

Nothing is written to storage until `saveSettings()`.

**Context value from `useTheme()`**

| Key | Notes |
| --- | --- |
| `theme` | The resolved token object. |
| `config`, `settings`, `savedSettings` | Raw inputs. |
| `isDirty` | Draft differs from saved. |
| `isDefault` | Draft equals the shipped defaults. |
| `updateSettings(patch)` | Accepts an object or an updater function. |
| `saveSettings()` | Promotes draft to saved, persists, fires `onSave`. |
| `cancelChanges()` | Discards the draft. |
| `resetSettings()` | Back to shipped defaults (still needs a save to persist). |
| `exportSettings()` | JSON string: `{ version, name, settings }`. |
| `importSettings(json)` | Returns `{ ok }` or `{ ok: false, error }` — **never throws**, so a bad file shows a message instead of losing the screen. |
| `mode`, `resolvedMode`, `isDark` | `mode` may be `'system'`; `resolvedMode` never is. |
| `density`, `setDensity` | |
| `setMode`, `toggleMode`, `modes` | Convenience wrappers. |

**Applied to the DOM** in a `useLayoutEffect` (before the browser paints, so
there is no flash of the previous theme): all CSS variables, plus
`data-theme`, `data-density`, `data-button-style`, `data-sidebar`,
`style.colorScheme` (themes native scrollbars, form controls and the caret),
and the `<meta name="theme-color">` tag.

**Outside a provider, `useTheme()` does not throw.** It warns once in dev and
returns a light-theme fallback with no-op setters — a missing provider should
not blank out the whole screen.

Two implementation details worth preserving if you refactor:

- `saveSettings` reads the draft from the closure, not from inside a state
  updater. Updaters must stay pure, and StrictMode runs them twice.
- The `matchMedia` listener falls back to `addListener` for Safari below 14.

### theme.css

Around 1,100 lines, no literal values — every declaration reads a custom
property. Sections: reset, accessibility, typography, layout, card, button,
input, badge, alert, loading + empty, table, segmented control, outlined button
style, select, slider, switch, colour picker, radio cards, tabs, settings rows.

The `ui-` prefix marks styling shared by both apps. Available classes include:

`ui-btn` (`-primary -secondary -ghost -danger -sm -lg -block -icon`) ·
`ui-card` (`-header -body -footer`) · `ui-input` · `ui-field` · `ui-label` ·
`ui-hint` · `ui-error` · `ui-badge` (`-info -success -warning -danger`) ·
`ui-alert` (same tones) · `ui-table` (`-wrap`, `ui-numeric`) · `ui-tabs` /
`ui-tab` · `ui-spinner` · `ui-skeleton` · `ui-empty` · `ui-divider` ·
`ui-stack` · `ui-cluster` · `ui-title-sm/md/lg` · `ui-text-secondary` ·
`ui-text-muted` · `ui-overline` · `ui-sr-only` · `ui-skip-link`

---

## Component library

Import from the barrel, never a file path:

```jsx
import { Button, FormField, Select } from './common/components'
```

All of them are **controlled and presentational**: props in, callbacks out, no
data fetching, no theme coupling. Every one accepts `className` (appended, not
replacing) and spreads `...rest` onto its DOM node. Most forward refs.

### Button

Token-driven classes only — a button never carries its own colours.

| Prop | Default | Notes |
| --- | --- | --- |
| `variant` | `'secondary'` | `primary` / `secondary` / `ghost` / `danger` |
| `size` | `'md'` | `sm` / `md` / `lg` |
| `loading` | `false` | Shows a spinner, keeps the width so the layout does not jump, sets `aria-busy`, and disables to stop double submits. |
| `fullWidth`, `iconOnly` | `false` | |
| `startIcon`, `endIcon` | — | Pass the icon **component**, not an element. Rendered at 16px, `aria-hidden`. |
| `disabled`, `type` | `false`, `'button'` | |

### Select

Built on the **native `<select>`** on purpose: keyboard support, type-ahead,
screen-reader semantics and a usable mobile picker, for none of the bundle size.
Options accept `{ value, label, disabled }` or plain strings.

Props: `options`, `value`, `onChange(value, event)`, `placeholder`, `disabled`,
`invalid`.

### Slider

Built on `<input type="range">`, so arrow keys, Home/End and Page Up/Down work
for free. `formatValue` keeps the unit out of the component (px, %, ms…) and
feeds `aria-valuetext`. The filled portion of the track is driven by a
`--slider-progress` custom property.

Props: `value`, `onChange(number, event)`, `min`, `max`, `step`, `showValue`,
`formatValue`, `disabled`.

### Switch

A `<button role="switch">` rather than a styled checkbox: it carries
`aria-checked`, responds to Space and Enter natively, and cannot be submitted
with a form by accident. Use it for settings that apply immediately.

Props: `checked`, `onChange(next)`, `label`, `describedBy`, `disabled`.

> Not currently used by any page — the config page's dark-mode switch was
> removed. It remains part of the library.

### SegmentedControl

An accessible radio group that looks like a button strip. Knows nothing about
themes — tabs, filters and view switchers can all reuse it. Icon-only buttons
still get an `aria-label` and a `title`.

Props: `options` (`{ value, label, icon?, disabled? }`), `value`, `onChange`,
`label` / `labelledBy`, `size`, `iconOnly`, `fullWidth`, `disabled`.

### RadioCardGroup

Same radiogroup semantics as `SegmentedControl`, rendered as cards — for options
easier to recognise than to read. Each option may carry a `preview` node, an
`icon`, a `label` and a `description`.

Props: `options`, `value`, `onChange`, `label` / `labelledBy`, `columns`,
`disabled`.

### ColorPicker

A native colour input, a typed hex/rgb field and optional presets, kept in sync.
**Only valid input is pushed to the parent**, so a half-typed `#2b` never
reaches the theme; invalid text is reported inline rather than silently dropped.
Commits on blur and on Enter.

| Prop | Notes |
| --- | --- |
| `value` | `null` when `allowAuto` and the value is derived. |
| `onChange` | Receives a canonical `#rrggbb`, or `null` for auto. |
| `presets` | Array of hex strings. |
| `allowAuto`, `autoLabel` | Adds a "derive it" reset button. |
| `resolvedValue` | The computed colour, so the swatch shows something real while on auto. |

> This is the only component that imports from the theme layer
> (`parseColor`, `rgbToHex` from `contrast.js`) — the least portable one.

### FormField

Owns the id and `aria-describedby` wiring — the part that usually rots when
every screen hand-rolls its own markup. `children` is a function so the control
receives exactly the props it must apply:

```jsx
<FormField label="Quantity" error={errors.qty} required>
  {({ id, describedBy, invalid }) => (
    <input id={id} aria-describedby={describedBy} aria-invalid={invalid} />
  )}
</FormField>
```

Use `labelAs="span"` for a group of controls (radios, segmented), which is
labelled by a span rather than a `<label>`.

> Not currently used by any page — its only consumer was the background image
> field. It remains part of the library, and is the right wrapper for any new
> form screen.

### ErrorBoundary

Catches render errors so a broken screen degrades into a readable message
instead of a blank page. `fallback` can be a node or a function receiving
`{ error, reset }`. `onError` forwards to your own logger — the component
deliberately knows nothing about which one you use. The error message is shown
in dev only.

---

## Hooks

### useRovingRadio

The WAI-ARIA radiogroup keyboard pattern, written once and shared by every
single-choice control. The group is **one tab stop**; arrow keys move focus and
change selection, Home/End jump to the ends, and disabled options are skipped.

```jsx
const radio = useRovingRadio({ options, value, onChange, disabled })

<div role="radiogroup">
  {options.map((o, i) => (
    <button key={o.value} {...radio.getOptionProps(i)}>{o.label}</button>
  ))}
</div>
```

`getOptionProps(index)` returns the ref, `role="radio"`, `aria-checked`,
`tabIndex` (roving — only the selected option, or the first usable one, is
tabbable), `disabled`, `onClick` and `onKeyDown`.

---

## The Theme Configuration page

`src/pages/Theme/ThemeConfigPage.jsx`

Every control writes straight into the provider's **draft** settings, so the
whole app — shell, header and the preview panel — updates as you change things.
Nothing is persisted until Save.

The page owns no business logic. Pass `onSave` to send the settings to your API,
and `onSaved` / `onCancel` to react:

```jsx
<ThemeConfigPage
  onSave={(settings) => api.put('/me/theme', settings)}
  onSaved={() => toast('Theme saved')}
/>
```

If `onSave` rejects, the page reports the error and **keeps the user's changes**.

**Sections:** Theme mode · Colours (primary, accent) · Typography (font family,
base size) · Buttons (style) · Background and surfaces (background, surface).

**Header actions:** Import, Export (downloads `theme.json`), Reset to default
(disabled when already default), Cancel (disabled when clean), Save changes
(disabled when clean).

**Live contrast warnings.** The page measures what will actually be rendered —
button label against the button fill, body text against the surface — and warns
below 4.5:1. A bad colour choice is caught here rather than in an audit three
months later. In practice only the body-text warning can fire now: with no
Label colour control, `buttonTextColor` stays `null` and the button label is
always computed to clear the threshold.

**`ThemePreview.jsx`** is built from the same `ui-` classes and tokens as the
real screens, so it cannot drift from the app: if an element looks right in the
preview, it looks right everywhere. It is free of domain content — every piece
of sample content (`brand`, `navItems`, `fields`, `columns`, `rows`, `actions`)
is an overridable prop, so a host app can make the preview look like its own
screens.

**`App.jsx`** is a demo shell with a page switcher. Only the Theme page is
built; the other ten render a placeholder. Each page is wrapped in an
`ErrorBoundary` keyed by page name, so a crash in one does not take out the nav.

---

## Accessibility

This is designed in, not bolted on:

- **Contrast is computed and enforced**, per surface, at 4.5:1 — including for
  colours the user picks at runtime.
- **A focus ring ships as a token** (`shadow.focus`) so it cannot be styled away.
- **Native elements wherever they work** — `<select>`, `<input type="range">`,
  `<button role="switch">` — rather than custom widgets that re-implement
  keyboard support badly.
- **One tab stop per radio group**, with arrow-key navigation (`useRovingRadio`).
- **Validation state is `aria-invalid`**, which is also what the error styling
  keys off — the visual and the accessible state cannot drift apart.
- **`aria-busy` on loading buttons**, which keep their width.
- **Icon-only controls always carry an accessible name.**
- A **skip link** (`ui-skip-link`) and a focusable `<main tabIndex={-1}>`.
- **44px minimum touch target** token (WCAG 2.5.5).
- `prefers-color-scheme` is followed live while the user is on "system".
- `color-scheme` is set so native UI (scrollbars, caret, form controls) matches.

---

## Reusing this in another app

The components are reusable, with one condition: **they are not standalone.**
All styling lives in `theme.css` under `ui-` class names, and that file has no
`:root` fallback block — every declaration reads a `var(--ui-…)` that
`ThemeProvider` injects at runtime. A `Button` without the provider renders
unstyled and effectively invisible.

So porting one component means porting the folder:

1. Copy `src/common/` wholesale — `theme/`, `components/`, `hooks/`.
2. Add `react`, `react-dom` and `lucide-react`. There are no other deps.
3. Mount the provider at the root (importing it also pulls in `theme.css`):

```jsx
import { ThemeProvider } from './common/theme'

createRoot(el).render(
  <ThemeProvider config={crmTheme} storageKey="crm-theme" onSave={persistToApi}>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </ThemeProvider>,
)
```

4. Copy the pre-paint script from `index.html` and match the storage key.
5. Optionally ship the Theme Config page too, or build your own UI against
   `updateSettings`.

**Watch out for:** `ui-` is a *global* class namespace — if the host app defines
its own `.ui-btn` you will get collisions. Change the prefix in `theme.css` if
that is a risk. The `prefix` prop covers the CSS variables, but the class names
are hardcoded.

---

## How to extend it

**Add a design token.** Add it to `tokens.js` (or to the object `resolveTheme`
returns, if it must be derived). It becomes `--ui-<path>` automatically — no
change needed in `cssVariables.js`.

**Add a user-facing setting.**

1. Add the field to `defaultSettings`, with a limit in `SETTING_LIMITS` if numeric.
2. Add a clamp/enum line to `normalizeSettings` — every read goes through it.
3. Consume it in `resolveTheme`, or write a `data-` attribute in `ThemeProvider`
   if CSS has to branch on it.
4. Add a `SettingRow` to `ThemeConfigPage.jsx`.

**Add a shared component.** Check `src/common/components/` first — the README
says so for a reason. If it is genuinely new: props in and callbacks out, no
data fetching, accept `className`, spread `...rest`, forward the ref, style it
with a new `ui-` class in `theme.css`, and export it from the barrel.

**Build one of the placeholder pages.** Compose the existing components and
`ui-` classes. If you find yourself typing a hex code or a px value, the token
is missing — add it rather than working around it.

---

## Conventions

- No hex codes, px values, font sizes or shadows outside `tokens.js`.
- New shared styling goes in `theme.css` as a `ui-` class, not into a page.
- Import from `common/theme` and `common/components`, never from the individual
  files — the barrels are the public API.
- Pages own data; components own presentation.
- Icons are passed as components (`startIcon={Save}`), sized by the component.
- Anything in `common/` must work unchanged in both apps: no business rules,
  no API calls, no hardcoded product labels.

---

## Known gaps and things to fix

| # | Issue |
| --- | --- |
| 1 | **`index.html` has no `<!DOCTYPE html>`.** The browser falls into quirks mode, which changes box sizing and table/line-height behaviour. One line, worth fixing first. |
| 2 | **`common/theme/README.md` documents props that do not exist.** Its setup example shows `<ThemeProvider defaultMode="system" defaultDensity="comfortable">`; the real props are `config`, `initialSettings`, `onSave`, `storageKey`, `prefix`, `persist`, `disableTransitionOnChange`. Mode and density are settings now, not props. |
| 3 | **Ten of the eighteen settings have no UI.** `borderColor`, `borderWidth`, `radius`, `headingWeight`, `bodyWeight`, `buttonTextColor`, `backgroundImage`, `density`, `sidebarPosition` and `contentWidth` still exist, are still validated by `normalizeSettings`, and still drive their tokens at default values — but the controls that edited them were removed from the config page. Either restore the controls or drop the fields from the token layer; right now they are reachable only via import, `initialSettings` or a direct `updateSettings` call. |
| 4 | **A contrast warning now points at a control that no longer exists.** The button-label warning in `ThemeConfigPage.jsx` ends "Clear the text colour to let the theme compute it" — there is no longer a Label colour picker to clear. With `buttonTextColor` stuck at `null` the value is always computed, so the warning is near-unreachable, but the wording should change if the row is not coming back. |
| 5 | **Every dependency is pinned to `"latest"`.** Two installs a month apart can produce different builds. Pin real ranges. |
| 6 | **No lint, format or test tooling** — no ESLint, Prettier or test runner, and no CI. `contrast.js` in particular is pure, dependency-free maths: the cheapest possible thing to unit-test. |
| 7 | **`ui-` is a global class namespace** with no build-time scoping. Fine inside this app, a collision risk when embedding. |
| 8 | **Ten of eleven pages are placeholders** (`.gitkeep` only). |
| 9 | **Three values are synced by hand** between `index.html` and the theme layer: the storage key and the two literal hex colours. A comment marks them; nothing enforces it. |
