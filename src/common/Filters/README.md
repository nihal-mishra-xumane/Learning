# Filters

`Filters` renders a configurable filter panel (select, multi-select,
checkbox group, radio group, date range, numeric range, and toggle fields)
plus a row of "active filter" chips, driven entirely by a `fields` config
array. Use it whenever a page needs a filter bar/panel and you don't want to
hand-build selects, checkboxes, and chip removal logic per page — define the
fields once and let the page own the resulting state.

## Usage

```jsx
import { useState } from 'react'
import { Filters } from '../../common'

const fields = [
  {
    type: 'select',
    name: 'department',
    label: 'Department',
    options: [
      { value: 'engineering', label: 'Engineering' },
      { value: 'sales', label: 'Sales' },
    ],
  },
  { type: 'toggle', name: 'activeOnly', label: 'Active only', description: 'Only show active items' },
]

function FilterBar() {
  const [value, setValue] = useState({ department: '', activeOnly: false })

  return (
    <Filters
      fields={fields}
      value={value}
      onChange={setValue}
      onApply={(next) => runSearch(next)}
    />
  )
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `fields` | array | `[]` | Field definitions — see below. |
| `value` | object | `{}` | Current filter state, keyed by `field.name` (controlled). |
| `onChange` | function | `() => {}` | Called with the next state whenever a field changes. In `mode="immediate"` this fires per keystroke/selection; it also fires on Apply, Reset, and chip removal/clear-all regardless of `mode`. |
| `onApply` | function | — | Called with the current state when the Apply button is pressed. |
| `onReset` | function | — | Called with the reset (default) state when the Reset button is pressed. |
| `mode` | `'immediate' \| any other value` | `'immediate'` | When `'immediate'`, field edits call `onChange` right away; any other value defers `onChange` until Apply (edits still update the panel's own draft state). |
| `className` | string | `''` | Extra class appended to the root element. |
| `title` | string | `'Filters'` | Panel heading. |
| `applyLabel` | string | `'Apply Filters'` | Apply button label. |
| `resetLabel` | string | `'Reset'` | Reset button label. |
| `disabled` | boolean | `false` | Disables all fields and the action buttons. |

### Field definition

| Key | Applies to | Description |
| --- | --- | --- |
| `type` | all | One of `select`, `multi`, `checkbox`, `radio`, `dateRange`, `range`, `toggle`. Unknown/omitted types fall back to `select`. |
| `name` | all | State key (required). |
| `label` | all | Field label. |
| `options` | `select`, `multi`, `checkbox`, `radio` | `{ value, label }[]`. |
| `description` | `toggle` | Helper text under the toggle label. |
| `min` / `max` / `step` | `range` | Bounds and step for the numeric inputs. |
| `minDate` / `maxDate` | `dateRange` | Bounds for the date inputs. |
| `loading` | all | Shows a loading state on the field. |
| `error` | all | Shows an inline error state on the field. |
| `disabled` | all | Disables that one field (in addition to the panel-level `disabled`). |

## Notes

- The active-filter chip row (with per-chip remove and "Clear all") is
  rendered automatically below the panel whenever any field has a non-empty
  value — there's no separate prop to control it.
- State shapes per type: `multi`/`checkbox` → array; `dateRange` →
  `{ from, to, invalid }`; `range` → `{ min, max }`; `toggle` → boolean;
  everything else → string.
