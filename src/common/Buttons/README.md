# Button Guide

`Button` is a reusable button for this React application. Use it on any page instead of writing another button component.

## Import the Button

From a page inside `src/pages`, import it from the common folder:

```jsx
import { Button } from '../../common'
```

This is a local component shared inside this application. It is not an npm package.

## Simple examples

```jsx
<Button>Save</Button>

<Button variant="danger" onClick={handleDelete}>
  Delete
</Button>

<Button type="submit">Submit form</Button>
```

## Change the appearance

Use props to change the button without creating a new component:

```jsx
<Button variant="success" size="lg">
  Approve
</Button>

<Button variant="outline" size="sm">
  Cancel
</Button>

<Button fullWidth rounded>
  Continue
</Button>
```

### Available values

`variant`:

```text
primary, secondary, success, danger, warning, info,
outline, ghost, text, link
```

`size`:

```text
xs, sm, md, lg, xl
```

The older size names `small`, `medium`, and `large` are also supported.

## Icons

Use `leftIcon` or `rightIcon`:

```jsx
import { ArrowRight, Save } from 'lucide-react'
import { Button } from '../../common'

<Button leftIcon={<Save size={16} />}>
  Save changes
</Button>

<Button rightIcon={<ArrowRight size={16} />}>
  Continue
</Button>
```

For an icon-only button, always provide an accessible name:

```jsx
import { MoreHorizontal } from 'lucide-react'

<Button square aria-label="More actions" title="More actions">
  <MoreHorizontal size={18} />
</Button>
```

## Loading and disabled buttons

```jsx
<Button loading loadingText="Saving...">
  Save
</Button>

<Button disabled>
  Not available
</Button>
```

A loading button automatically becomes disabled and gets `aria-busy="true"`.

## Useful props

| Prop | Example | What it does |
| --- | --- | --- |
| `variant` | `variant="danger"` | Changes the button style |
| `size` | `size="lg"` | Changes the button size |
| `fullWidth` | `fullWidth` | Uses the full parent width |
| `rounded` | `rounded` | Makes the button pill-shaped |
| `square` | `square` | Creates an icon-sized square button |
| `leftIcon` | `leftIcon={<Save />}` | Adds an icon before the text |
| `rightIcon` | `rightIcon={<ArrowRight />}` | Adds an icon after the text |
| `loading` | `loading` | Shows a spinner and disables the button |
| `loadingText` | `loadingText="Saving..."` | Text shown during loading |
| `disabled` | `disabled` | Prevents clicking |
| `badge` | `badge="3"` | Shows a small count badge |
| `pressed` | `pressed={isPinned}` | Adds toggle-button accessibility state |
| `className` | `className="my-button"` | Adds custom page styling |
| `type` | `type="submit"` | Supports `button`, `submit`, or `reset` |

Normal button props such as `onClick`, `title`, `name`, `value`, and ARIA attributes are passed to the native button element.

## Use it on another page

Keep state and business logic in the page. Pass the page values and event handlers into `Button`:

```jsx
import { Button } from '../../common'

export default function RequestActions({ saving, onApprove }) {
  return (
    <Button
      variant="success"
      loading={saving}
      loadingText="Approving..."
      onClick={onApprove}
    >
      Approve request
    </Button>
  )
}
```

Do not create separate components such as `PrimaryButton` or `DangerButton`. Use the shared `Button` with different props.
