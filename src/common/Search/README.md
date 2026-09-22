# Common Search

This is a shared Search component for the app. Any page can import it and use the same UI pattern without rewriting search logic.

## Import it

```jsx
import { Search } from '../../common/Search';
```

## Example usage

### 1. Text search

```jsx
const [query, setQuery] = useState('');

<Search
  type="text"
  value={query}
  placeholder="Search users..."
  onChange={setQuery}
  onSearch={(value) => console.log('Search text:', value)}
/>
```

### 2. Multi-select search

```jsx
const [selected, setSelected] = useState(['engineering', 'sales']);

<Search
  type="multi"
  label="Departments"
  options={departmentOptions}
  value={selected}
  onChange={setSelected}
  placeholder="Search departments..."
/>
```

### 3. Autocomplete

```jsx
const [value, setValue] = useState('');

<Search
  type="autocomplete"
  value={value}
  placeholder="Search customers..."
  suggestions={customerSuggestions}
  onChange={setValue}
  onSearch={(text) => console.log('searching:', text)}
  onSuggestionSelect={(item) => console.log('selected:', item)}
/>
```

### 4. Dropdown search

```jsx
const [selectedStatus, setSelectedStatus] = useState('active');

<Search
  type="dropdown"
  options={statusOptions}
  value={selectedStatus}
  onChange={setSelectedStatus}
  placeholder="Select status"
/>
```

## How to reuse it on another page

1. Import the component.
2. Keep the search state in the page.
3. Pass the options, value, and callbacks from the page.
4. Let the page handle API/business logic.
5. Reuse the same component everywhere.

## Best practice

The common Search component handles the UI and interaction behavior only. The page should own:

- API requests
- business rules
- filtered results logic
- page-specific data loading

This keeps the component generic and reusable across Customers, employees, products, reports, and other screens.
