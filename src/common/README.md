# Common

Common component pages will be added here step by step.

## Button

Use the shared Button for actions across CRM and Procurement screens:

```jsx
import Button from './Buttons/Button'

<Button variant="primary" size="medium" icon={<SaveIcon />}>
	Save
</Button>

<Button variant="secondary">Cancel</Button>
<Button variant="danger" disabled>Delete</Button>
<Button loading loadingText="Saving...">Save</Button>
<Button fullWidth>Continue</Button>
```

Supported variants are `primary`, `secondary`, `danger`, and `text`. Sizes are
`small`, `medium`, and `large`. Pass `iconPosition="right"` for trailing icons;
icon-only buttons should provide an `aria-label`.

## Form controls

Reusable controls are exported from `common/Forms`:

```jsx
import { Input, Select, Checkbox, Radio, DatePicker, Textarea } from './Forms'

<Input label="Email" type="email" value={email} onChange={handleEmailChange} />
<Select label="Department" options={departmentOptions} value={department} onChange={handleDepartmentChange} />
<Checkbox label="Accept terms" checked={accepted} onChange={handleAcceptedChange} />
<Radio name="status" value="active" label="Active" checked={status === 'active'} onChange={handleStatusChange} />
<DatePicker label="Start date" value={startDate} onChange={handleDateChange} />
<Textarea label="Notes" value={notes} onChange={handleNotesChange} rows={4} />
```

Controls support native form props, forwarded refs, `fullWidth`, and externally
controlled `error`, `errorMessage`, `helperText`, `disabled`, and `required` states.
`Select` accepts `{ label, value, disabled }` options and an `emptyMessage` prop.
