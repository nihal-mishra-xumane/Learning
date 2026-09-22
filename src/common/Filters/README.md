# Common Filters

This is the shared filter system for the app. Any page can import it and configure its own filter fields without rewriting the UI.

## Import it

```jsx
import { Filters } from '../../common/Filters';
```

## Example usage

```jsx
const filterConfig = [
  {
    type: 'select',
    name: 'department',
    label: 'Department',
    placeholder: 'Select department',
    options: [
      { label: 'Engineering', value: 'engineering' },
      { label: 'Finance', value: 'finance' },
      { label: 'Sales', value: 'sales' },
    ],
  },
  {
    type: 'multi',
    name: 'status',
    label: 'Status',
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Pending', value: 'pending' },
      { label: 'Inactive', value: 'inactive' },
    ],
  },
  {
    type: 'dateRange',
    name: 'date',
    label: 'Date Range',
  },
  {
    type: 'toggle',
    name: 'activeOnly',
    label: 'Active Only',
    description: 'Only show active items',
  },
];

const [filters, setFilters] = useState({
  department: '',
  status: [],
  date: { from: '', to: '', invalid: false },
  activeOnly: false,
});

<Filters
  fields={filterConfig}
  value={filters}
  onChange={setFilters}
  onApply={(nextFilters) => console.log('Apply filters:', nextFilters)}
  onReset={() => setFilters({ department: '', status: [], date: { from: '', to: '', invalid: false }, activeOnly: false })}
/>
```

## How to reuse it on another page

1. Create a filter config array for that page.
2. Define the options for each field.
3. Keep filter state in the page component.
4. Pass the state to the shared component through `value`.
5. Use `onChange` for updates and `onApply` for apply actions.
6. Reuse the same shared component for all pages.

## Page examples

### Customers page

```jsx
<Filters
  fields={customerFilterConfig}
  value={customerFilters}
  onChange={setCustomerFilters}
  onApply={handleCustomerApply}
/>
```

### Employees page

```jsx
<Filters
  fields={employeeFilterConfig}
  value={employeeFilters}
  onChange={setEmployeeFilters}
  onApply={handleEmployeeApply}
/>
```

### Products page

```jsx
<Filters
  fields={productFilterConfig}
  value={productFilters}
  onChange={setProductFilters}
  onApply={handleProductApply}
/>
```

## Best practice

The common Filters component handles the UI, selection, validation, and reset behavior. The page should own:

- business logic
- API calls
- data fetching
- page-specific actions after Apply

This keeps the filter library generic and ready for reuse across the whole application.
