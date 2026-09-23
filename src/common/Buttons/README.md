# Button

A single button component for every action in the app — primary/secondary/danger
actions, icon-only toolbar buttons, loading/submit states, toggle buttons. Use it
instead of writing a one-off `<button>` or a variant-specific component
(`PrimaryButton`, `DangerButton`, etc.); pass props instead. Self-contained — copy
`Buttons/` (both files) into another project and it works unchanged.

## Usage

```jsx
import { Button } from '../../common'
import { Save } from 'lucide-react'

<Button variant="danger" onClick={handleDelete}>
  Delete
</Button>

<Button leftIcon={<Save size={16} />} loading={saving} loadingText="Saving...">
  Save changes
</Button>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'primary' \| 'secondary' \| 'danger' \| 'success' \| 'warning' \| 'info' \| 'outline' \| 'ghost' \| 'link' \| 'text'` | `'primary'` | Visual style. |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Button size. The aliases `small`/`medium`/`large` are also accepted and normalized to `sm`/`md`/`lg`. |
| `icon` | node | — | Icon rendered at `iconPosition` when `leftIcon`/`rightIcon` aren't given. |
| `iconPosition` | `'left' \| 'right'` | `'left'` | Where `icon` is placed. |
| `leftIcon` | node | — | Icon before the label (overrides `icon`). |
| `rightIcon` | node | — | Icon after the label (overrides `icon`). |
| `loading` | boolean | `false` | Shows a spinner in place of the icon, disables the button, and sets `aria-busy`. |
| `loadingText` | node | — | Replaces `children` while `loading` is true (falls back to `children` if omitted). |
| `disabled` | boolean | `false` | Disables the button. |
| `fullWidth` | boolean | `false` | Stretches the button to 100% of its container. |
| `rounded` | boolean | `false` | Pill-shaped corners. |
| `square` | boolean | `false` | Forces the icon-only square sizing even if `children` is present. |
| `badge` | node | `null` | Small count/label rendered at the end of the button. |
| `pressed` | boolean | — | Sets `aria-pressed` for toggle-style buttons. Omitted entirely (not `false`) when not provided. |
| `className` | string | `''` | Extra class appended to the root `<button>`. |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Native button type. |
| `children` | node | — | Button label/content. |

Any other prop (`onClick`, `aria-label`, `title`, `name`, `value`, `id`, …) is passed
straight through to the native `<button>`.

## Notes

- A button with only an icon and no `children` automatically gets the icon-only
  square treatment (or pass `square` explicitly). It still needs its own
  `aria-label` — Button has no way to infer one from an icon:
  ```jsx
  <Button square aria-label="More actions"><MoreHorizontal size={18} /></Button>
  ```
- `loading` takes over `disabled` automatically; you don't need to pass both.
