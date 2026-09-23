# Tabs

A controlled tab switcher with two visual variants (underline, pills), optional icons and
counts per tab, disabled tabs, and a full keyboard-accessible ARIA `tablist`/`tab` pattern
with a sliding active indicator. Use it whenever a page needs to switch between views of
the same record/screen without navigating (e.g. Overview / Contacts / Deals on a record
page).

## Usage

```jsx
import { useState } from 'react'
import { Users } from 'lucide-react'
import { Tabs } from '../../common'

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'contacts', label: 'Contacts', count: 12, icon: <Users /> },
  { id: 'archived', label: 'Archived', disabled: true },
]

function RecordTabs() {
  const [activeTab, setActiveTab] = useState('overview')
  return <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} variant="pills" />
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `tabs` | array | `[]` | `{ id, label, icon?, count?, disabled? }[]`. `icon` must be a rendered node (e.g. `<Users />`), not a component reference. |
| `activeTab` | string | — | `id` of the currently selected tab. |
| `onChange` | function | — | Called with a tab's `id` when it's selected, via click or arrow-key navigation. Never called for a `disabled` tab. |
| `variant` | string | `'underline'` | `'underline'` (sliding underline indicator) or `'pills'` (segmented background). |

## Notes

- Fully keyboard-navigable: ArrowLeft/Right/Up/Down move focus and selection between
  enabled tabs (wrapping), Home/End jump to the first/last enabled tab, and disabled tabs
  are skipped. Uses a roving `tabIndex` per the standard ARIA tablist pattern.
- If `activeTab` doesn't match any enabled tab's `id`, focus falls back to the first
  enabled tab, but no tab is visually marked active until `activeTab` matches one.
- Copy both `Tabs.jsx` and `Tabs.css` together; the component has no other dependencies
  beyond `react`.
