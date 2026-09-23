# Search

`Search` is a single entry point that renders one of four search UI
patterns — plain text search, multi-select search, autocomplete-with-
suggestions, and a searchable single-select dropdown — chosen via the
`type` prop. Use it instead of hand-building a search input, a
multi-select-with-chips, or a typeahead per page; pick the `type` that
matches the interaction you need and pass that variant's props straight
through.

## Usage

```jsx
import { useState } from 'react'
import { Search } from '../../common'

// Text search
const [query, setQuery] = useState('')
<Search type="text" value={query} onChange={setQuery} onSearch={(v) => runSearch(v)} />

// Multi-select
const [selected, setSelected] = useState([])
<Search type="multi" label="Departments" options={departmentOptions} value={selected} onChange={setSelected} />

// Autocomplete
<Search
  type="autocomplete"
  value={query}
  suggestions={customerSuggestions}
  onChange={setQuery}
  onSuggestionSelect={(item) => openCustomer(item)}
/>

// Dropdown
const [status, setStatus] = useState('active')
<Search type="dropdown" options={statusOptions} value={status} onChange={setStatus} />
```

## Props

`Search` itself only reads `type` (`'text' | 'multi' | 'autocomplete' | 'dropdown'`,
default `'text'`) and forwards every other prop to the matching component
below.

### `type="text"` (TextSearch)

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | string | — | Controlled value. Omit to let the component manage its own state (uses `defaultValue`). |
| `defaultValue` | string | `''` | Initial value when uncontrolled. |
| `placeholder` | string | `'Search...'` | Input placeholder, also used as the fallback accessible label. |
| `onChange` | function | — | Called with the next string on every keystroke. |
| `onSearch` | function | — | Called with the debounced value after `debounceMs` of no changes. |
| `debounceMs` | number | `400` | Debounce delay for `onSearch`. |
| `loading` | boolean | `false` | Shows a spinner. |
| `error` | string | — | Error text shown below the field. |
| `disabled` | boolean | `false` | Disables the input. |
| `ariaLabel` | string | — | Accessible label override (defaults to `placeholder`). |
| `clearable` | boolean | `true` | Shows a clear ("×") button when there's a value. |
| `noResults` | boolean | `false` | Shows `emptyMessage` below the field. |
| `emptyMessage` | string | `'No results found.'` | Text shown when `noResults` is true. |
| `className` | string | `''` | Extra class appended to the field. |

### `type="multi"` (MultiSearch)

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `options` | array | `[]` | `{ value, label }[]`. |
| `value` | array | `[]` | Selected values (controlled). |
| `onChange` | function | — | Called with the next array of values. |
| `placeholder` | string | `'Search options...'` | Placeholder for the option-filter input inside the dropdown. |
| `disabled` | boolean | `false` | Disables selection. |
| `loading` | boolean | `false` | Shows a loading state in the trigger and dropdown. |
| `emptyMessage` | string | `'No options available.'` | Shown when no options match the filter. |
| `label` | string | `'Options'` | Panel heading. |
| `className` | string | `''` | Extra class appended to the root. |

### `type="autocomplete"` (AutocompleteSearch)

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | string | — | Controlled value. Omit to manage internally (uses `defaultValue`). |
| `defaultValue` | string | `''` | Initial value when uncontrolled. |
| `placeholder` | string | `'Search...'` | Input placeholder. |
| `suggestions` | array | `[]` | Strings or `{ label, value }` objects. |
| `onChange` | function | — | Called with the next string on every keystroke. |
| `onSearch` | function | — | Called with the debounced, trimmed query. |
| `onSuggestionSelect` | function | — | Called with the selected suggestion's value/label. |
| `debounceMs` | number | `350` | Debounce delay for `onSearch`. |
| `loading` | boolean | `false` | Shows a loading state. |
| `disabled` | boolean | `false` | Disables the input. |
| `error` | string | — | Error text shown below the field. |
| `ariaLabel` | string | — | Accessible label override. |
| `emptyMessage` | string | `'No suggestions found.'` | Shown when there are no matching suggestions. |
| `className` | string | `''` | Extra class appended to the root. |

### `type="dropdown"` (DropdownSearch)

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `options` | array | `[]` | `{ value, label }[]`. |
| `value` | any | — | Selected value (controlled). |
| `onChange` | function | — | Called with the selected option's value, or `null` when cleared. |
| `placeholder` | string | `'Select an option'` | Shown when nothing is selected. |
| `disabled` | boolean | `false` | Disables the trigger. |
| `loading` | boolean | `false` | Shows a loading state on the trigger. |
| `emptyMessage` | string | `'No options available.'` | Shown when no options match the in-dropdown filter. |
| `ariaLabel` | string | — | Accessible label override (defaults to `placeholder`). |
| `className` | string | `''` | Extra class appended to the root. |

## Notes

- `TextSearch` and `AutocompleteSearch` support both controlled (`value` +
  `onChange`) and uncontrolled (`defaultValue` only) usage — passing `value`
  (even `''`) puts them in controlled mode.
- `AutocompleteSearch`'s listbox supports Arrow Up/Down, Enter, and Escape.
- Each variant renders its own dropdown/trigger; there's no shared "search
  shell" component to compose them — pick the `type` up front per field.
