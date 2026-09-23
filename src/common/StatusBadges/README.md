# StatusBadge

A small pill-shaped label for showing a record's state at a glance (e.g. a row status in a
table, a record's lifecycle stage). Ships with five semantic tones out of the box
(`neutral`, `info`, `success`, `warning`, `danger`) and lets a host app supply its own
status vocabulary via `statusConfig` without adding any business logic to the component
itself.

## Usage

```jsx
import { StatusBadge } from '../../common'

// Built-in tones
<StatusBadge status="success" />
<StatusBadge status="warning" label="Needs review" />

// Custom status vocabulary
const reviewStatusConfig = {
  draft: { label: 'Draft', tone: 'neutral' },
  review: { label: 'In review', tone: 'info' },
  approved: { label: 'Approved', tone: 'success' },
  changes: { label: 'Changes requested', tone: 'warning' },
}

<StatusBadge status="review" statusConfig={reviewStatusConfig} />
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `status` | string | `'neutral'` | Key looked up in `statusConfig` to resolve a label and tone. Also used as the fallback display text if no matching entry and no `label` is given. |
| `label` | string | — | Overrides the resolved display text, independent of `status`/`statusConfig`. |
| `statusConfig` | object | built-in map of `neutral`/`info`/`success`/`warning`/`danger` | `{ [status]: { label, tone } }`. Unknown `status` keys fall back to the built-in `neutral` entry. |
| `tone` | string | — | Overrides the resolved visual tone (`neutral`\|`info`\|`success`\|`warning`\|`danger`), independent of `status`/`statusConfig`. |
| `dot` | bool | `true` | Shows/hides the small leading dot indicator. |

## Notes

- `tone` controls styling only; `label`/`status` control the resolved text — they resolve
  independently, so you can e.g. keep a custom `label` while forcing a `danger` `tone`.
- Copy both `StatusBadge.jsx` and `StatusBadge.css` together; the component has no other
  dependencies.
