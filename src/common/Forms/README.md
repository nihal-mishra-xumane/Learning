# Forms

A family of native-HTML-backed form controls (`Input`, `DatePicker`, `Select`,
`Textarea`, `Checkbox`, `Radio`, `Switch`, `FileUpload`, `RangeSlider`) plus the
`FormField` wrapper they all share for label/required-mark/helper-error-warning-
success text. Use these instead of hand-rolled `<input>`/`<select>`/`<textarea>`
markup anywhere a page needs to collect data. Self-contained — copy `Forms/`
(all files, including `forms.css`) into another project and it works unchanged.

Every control is uncontrolled-or-controlled: pass `value`/`onChange` to control it
from the page, or `defaultValue`/`defaultChecked` and let the control manage its
own state.

## Usage

```jsx
import { Input, Select, Checkbox, Button } from '../../common'

const [email, setEmail] = useState('')

<Input
  label="Work email"
  type="email"
  value={email}
  onChange={(event) => setEmail(event.target.value)}
  required
  fullWidth
/>

<Select
  label="Department"
  value={department}
  onChange={(event) => setDepartment(event.target.value)}
  placeholder="Choose a department"
  options={[{ label: 'Sales', value: 'sales' }, { label: 'Finance', value: 'finance' }]}
  fullWidth
/>

<Checkbox
  label="Send a copy to my team"
  checked={sendCopy}
  onChange={(event) => setSendCopy(event.target.checked)}
  description="Keep collaborators informed."
/>
```

## Shared feedback props

`Input`, `Select`, `Textarea`, `Checkbox`, `Radio`, `Switch`, `FileUpload`, and
`RangeSlider` all accept the same validation-state props, implemented by the
shared `FormField` wrapper:

| Prop | Type | Default | Description |
|---|---|---|---|
| `error` | boolean | `false` | Marks the control invalid (`aria-invalid`, red border on the control). |
| `errorMessage` | string | — | Message shown below the control when `error` is true. Takes priority over warning/success/helper text. |
| `warning` | boolean | `false` | Marks the control as needing attention (amber border). |
| `warningMessage` | string | — | Message shown when `warning` is true (and no error). |
| `success` | boolean | `false` | Marks the control as validated (green border). |
| `successMessage` | string | — | Message shown when `success` is true (and no error/warning). |
| `helperText` | node | — | Fallback message shown when none of error/warning/success apply. |
| `required` | boolean | `false` | Adds a visible `*` and sets the native `required` attribute. |
| `className` | string | `''` | Extra class appended to the control's own element (not the `FormField` wrapper). |

`errorMessage`/`warningMessage`/`successMessage` are wired to the control via
`aria-describedby` automatically — you don't need to manage ids yourself.

## FormField

The layout primitive every control above renders into: an optional `<label>`,
the control itself (`children`), and a message/counter line below it. Use it
directly only if you're building a new field type that needs the same
label/error/helper layout.

```jsx
import { FormField } from '../../common'

<FormField id="custom-field" label="Custom control" error errorMessage="Required.">
  <MyCustomInput id="custom-field" />
</FormField>
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `id` | string | — | Id of the control inside; used for the `<label htmlFor>` and message `aria-describedby` wiring. |
| `label` | string | — | Field label rendered above `children`. |
| `required` | boolean | `false` | Appends a `*` next to the label. |
| `error` / `errorMessage` | boolean / string | `false` / — | See shared feedback props above. |
| `warning` / `warningMessage` | boolean / string | `false` / — | See shared feedback props above. |
| `success` / `successMessage` | boolean / string | `false` / — | See shared feedback props above. |
| `helperText` | node | — | Fallback message. |
| `counter` | node | — | Extra text rendered under the message line (e.g. a character counter). |
| `fullWidth` | boolean | `false` | Adds `common-field--full-width` to the wrapper. |
| `className` | string | `''` | Extra class on the wrapper `<div>`. |
| `children` | node | — | The control markup. |

## Input

Text, email, password, number, tel, url, search — anything backed by
`<input>`. `DatePicker` (below) is a thin wrapper around it.

```jsx
<Input label="Amount" type="number" prefix="$" />
<Input label="Search" type="search" clearable onClear={() => setQuery('')} />
<Input label="Password" type="password" showPasswordToggle />
<Input label="Description" characterLimit={80} showCounter />
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | string | — | Field label. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Control height/font size. |
| `fullWidth` | boolean | `false` | Stretches the input to 100% width. |
| `prefix` / `suffix` | node | — | Static text/icon shown inside the field before/after the input (e.g. `$`, `CRM`). |
| `leftIcon` / `rightIcon` | node | — | Decorative icon inside the field. `rightIcon` is hidden while `clearable` or the password toggle button is showing. |
| `clearable` | boolean | `false` | Shows a clear (×) button once there's a value. |
| `onClear` | function | — | Called when the clear button is clicked; if omitted, `onChange` is called with an empty value instead. |
| `showPasswordToggle` | boolean | `false` | Shows a show/hide button; only takes effect when `type="password"`. |
| `characterLimit` | number | — | Sets native `maxLength` and appears in the counter (`n/limit`) if `showCounter` or this is set. |
| `showCounter` | boolean | `false` | Shows a character counter even without `characterLimit`. |
| `name`, `type`, `value`, `defaultValue`, `onChange` | — | `type='text'` | Standard input plumbing. |

Any other prop (`placeholder`, `disabled`, `readOnly`, `min`, `max`, `id`, …) is
passed through to the native `<input>`.

## DatePicker

```jsx
<DatePicker
  label="Review date"
  value={date}
  onChange={(event) => setDate(event.target.value)}
  min="2025-01-01"
  max="2030-12-31"
/>
```

`DatePicker` is `<Input type="date" {...props} />` — every `Input` prop above
applies (including `leftIcon`, `fullWidth`, validation props), except `type`,
which is fixed.

## Select

```jsx
<Select
  label="Department"
  value={department}
  onChange={(event) => setDepartment(event.target.value)}
  placeholder="Choose a department"
  options={[
    { label: 'Sales', value: 'sales' },
    { label: 'Restricted', value: 'restricted', disabled: true },
  ]}
/>
```

Grouped options (rendered as `<optgroup>`) are supported — give a top-level
entry a `label` and a nested `options` array instead of a `value`:

```jsx
const options = [
  { label: 'Commercial', options: [{ label: 'Sales', value: 'sales' }] },
]
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | string | — | Field label. |
| `options` | `{ label, value, disabled? }[] \| { label, options }[]` | `[]` | Flat or grouped option list. |
| `placeholder` | string | — | Renders as a disabled/blank first `<option value="">`. |
| `emptyMessage` | string | `'No options available'` | Shown as the only (disabled) option when `options` is empty. |
| `loading` | boolean | `false` | Disables the select and sets `aria-busy`. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Control height/font size. |
| `fullWidth` | boolean | `false` | Stretches the select to 100% width. |
| `disabled` | boolean | `false` | Disables the select. |

Select uses a native `<select>`, not a custom listbox, so it gets built-in
keyboard and mobile support for free.

## Textarea

```jsx
<Textarea
  label="Notes"
  value={notes}
  onChange={(event) => setNotes(event.target.value)}
  rows={4}
  characterLimit={240}
  showCounter
/>
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | string | — | Field label. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Font size (the textarea's own min-height stays fixed). |
| `fullWidth` | boolean | `false` | Stretches the textarea to 100% width. |
| `characterLimit` | number | — | Sets native `maxLength` and appears in the counter if set. |
| `showCounter` | boolean | `false` | Shows a character counter even without `characterLimit`. |
| `resize` | `'vertical' \| 'none' \| 'horizontal' \| 'both'` | `'vertical'` | Sets the CSS `resize` behavior. |
| `value`, `defaultValue`, `onChange` | — | — | Standard textarea plumbing. |

Any other prop (`rows`, `placeholder`, `disabled`, `readOnly`, `id`, …) is
passed through to the native `<textarea>`.

## Checkbox / Radio / Switch

Small choice controls that share one shape. `label` is the text next to the
control itself (not a `FormField`-level label above it).

```jsx
<Checkbox
  label="Send a copy to my team"
  checked={sendCopy}
  onChange={(event) => setSendCopy(event.target.checked)}
  description="Keep collaborators informed."
/>

<fieldset className="radio-group">
  <legend>Payment method</legend>
  <Radio name="payment" value="card" label="Card" checked={method === 'card'} onChange={handleMethod} />
  <Radio name="payment" value="invoice" label="Invoice" checked={method === 'invoice'} onChange={handleMethod} />
</fieldset>

<Switch
  label="Email notifications"
  checked={notifications}
  onChange={(event) => setNotifications(event.target.checked)}
/>
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | node | — | Text next to the control. |
| `description` | node | — | Alias for `helperText` (whichever is set wins if both are). |
| `indeterminate` | boolean | `false` | **Checkbox only.** Sets the native indeterminate visual state (requires a ref). |

Standard input props (`checked`, `defaultChecked`, `onChange`, `disabled`,
`name`, `value`) are passed through to the native `<input type="checkbox">` /
`<input type="radio">`. Radio groups rely on native `name`-based keyboard
behavior — no extra wiring needed beyond giving each `Radio` the same `name`.
`radio-group` (used on the wrapping `<fieldset>` above) is a plain utility
class shipped in `forms.css`, not a prop.

## FileUpload

```jsx
<FileUpload
  label="Supporting documents"
  accept=".pdf,.doc,.docx"
  multiple
  onChange={handleFiles}
  helperText="PDF or Word documents, up to 10 MB each."
/>
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | string | `'Upload file'` | Field label above the drop zone. |
| `description` | node | — | Alias for `helperText`. |
| `accept` | string | — | Native `accept` attribute (MIME types / extensions). |
| `multiple` | boolean | `false` | Allows selecting more than one file; also changes the drop-zone text ("Choose files"). |

Always renders full width (there's no `fullWidth` prop to opt out). The
"or drag and drop" text is descriptive only — there's no `onDrop`/drag-over
handling wired up, so dragging a file onto it won't select it; only
click-to-browse works.

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

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | string | — | Field label. |
| `min` / `max` / `step` | number | `0` / `100` / `1` | Native range attributes. |
| `value`, `defaultValue`, `onChange` | — | `defaultValue: 50` | Standard range plumbing. |
| `showValue` | boolean | `true` | Shows the current numeric value next to the track. |

Always renders full width (there's no `fullWidth` prop to opt out).

## Controlled vs. uncontrolled

`Input`, `Textarea`, and `RangeSlider` track their own internal state when you
don't pass `value` (i.e. use `defaultValue`), so `clearable`, the character
counter, and the slider's displayed value all work without the page wiring up
state. Once you pass `value`, the control becomes fully controlled and the
page is responsible for updating it via `onChange`.
