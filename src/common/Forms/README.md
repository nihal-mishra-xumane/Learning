# Form Controls Guide

The controls in this folder are reusable form parts for this React application. Pages share the same controls by importing them from `../../common`.

## Import the controls

```jsx
import {
  Checkbox,
  DatePicker,
  FileUpload,
  Input,
  Radio,
  RangeSlider,
  Select,
  Switch,
  Textarea,
} from '../../common'
```

These are local application components, not a separate npm package.

## The basic idea

The page owns the data and the control displays it:

```jsx
const [email, setEmail] = useState('')

<Input
  label="Email"
  value={email}
  onChange={(event) => setEmail(event.target.value)}
/>
```

Keep API calls, validation rules, option lists, and form submission logic in the page. Keep generic display and input behavior in these common components.

## Input

Use `Input` for text, email, password, number, telephone, URL, and search fields.

```jsx
<Input
  label="Work email"
  type="email"
  value={email}
  onChange={(event) => setEmail(event.target.value)}
  placeholder="name@company.com"
  required
  fullWidth
/>
```

Useful options:

```jsx
<Input label="Amount" type="number" prefix="$" />
<Input label="Search" type="search" clearable />
<Input label="Password" type="password" showPasswordToggle />
<Input label="Name" leftIcon={<UserIcon />} />
<Input label="Code" suffix="CRM" />
<Input label="Description" characterLimit={80} showCounter />
```

Input sizes are `sm`, `md`, and `lg`.

## Select

```jsx
<Select
  label="Department"
  value={department}
  onChange={(event) => setDepartment(event.target.value)}
  placeholder="Choose a department"
  options={[
    { label: 'Sales', value: 'sales' },
    { label: 'Finance', value: 'finance' },
    { label: 'Archived', value: 'archived', disabled: true },
  ]}
/>
```

Select sizes are `sm`, `md`, and `lg`. Group options like this:

```jsx
const options = [
  {
    label: 'Commercial',
    options: [
      { label: 'Sales', value: 'sales' },
      { label: 'Procurement', value: 'procurement' },
    ],
  },
]
```

## Textarea

```jsx
<Textarea
  label="Notes"
  value={notes}
  onChange={(event) => setNotes(event.target.value)}
  rows={4}
  characterLimit={240}
  showCounter
  helperText="Add useful context for the next reviewer."
/>
```

Use `resize="none"`, `resize="vertical"`, or `resize="horizontal"`.

## Checkbox and Radio

```jsx
<Checkbox
  label="Send a copy to my team"
  checked={sendCopy}
  onChange={(event) => setSendCopy(event.target.checked)}
  description="Keep collaborators informed."
/>
```

For radio choices, use the same `name` and wrap the group in a fieldset:

```jsx
<fieldset>
  <legend>Payment method</legend>
  <Radio name="payment" value="card" label="Card" />
  <Radio name="payment" value="invoice" label="Invoice" />
</fieldset>
```

`Checkbox` also supports `indeterminate`.

## DatePicker

`DatePicker` uses the browser's native date input:

```jsx
<DatePicker
  label="Review date"
  value={date}
  onChange={(event) => setDate(event.target.value)}
  min="2025-01-01"
  max="2030-12-31"
  required
/>
```

## Switch

Use `Switch` for an on/off setting:

```jsx
<Switch
  label="Email notifications"
  checked={notifications}
  onChange={(event) => setNotifications(event.target.checked)}
  description="Receive updates about changes."
/>
```

## FileUpload

`FileUpload` displays a file picker and passes the normal file input event to your page:

```jsx
<FileUpload
  label="Supporting documents"
  accept=".pdf,.doc,.docx"
  multiple
  onChange={handleFiles}
  helperText="PDF or Word documents."
/>
```

The page should handle file validation and uploading.

## RangeSlider

```jsx
<RangeSlider
  label="Approval threshold"
  min={0}
  max={100}
  step={5}
  value={threshold}
  onChange={(event) => setThreshold(event.target.value)}
/>
```

Use `showValue={false}` if you do not want to display the current value.

## Shared feedback props

Most controls support:

```jsx
<Input
  label="Request title"
  error
  errorMessage="A title is required."
/>

<Input
  label="Work email"
  success
  successMessage="Email looks good."
/>

<Input
  label="Review status"
  warning
  warningMessage="Choose a status before continuing."
/>
```

They also support `helperText`, `required`, `disabled`, `readOnly`, `className`, and `fullWidth` where appropriate.

Error feedback takes priority over warning, success, and helper text.

## Controlled and initial values

Use `value` and `onChange` when the page needs to track changes:

```jsx
<Input
  label="Request title"
  value={title}
  onChange={(event) => setTitle(event.target.value)}
/>
```

Use `defaultValue` for an initial value that does not need page state:

```jsx
<Textarea label="Imported notes" defaultValue="Previous notes" />
```

## Accessibility reminders

- Give controls a clear label.
- Use a unique `id` when another element needs to refer to the control.
- Use `fieldset` and `legend` for radio or checkbox groups.
- Give error states an `errorMessage`; the control will set `aria-invalid` and connect the message with `aria-describedby`.
- Give icon-only buttons inside a form an `aria-label`.
