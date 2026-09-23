# Modals

`Modal` is the base dialog primitive: a portal-rendered overlay with focus
trapping, Escape-to-close, body-scroll locking, an optional loading state,
and an optional built-in multi-step wizard flow. `AuthModal`, `CreateModal`,
and `UploadDocumentModal` are specialized dialogs built on top of `Modal` for
three common jobs — sign in/sign up, a generic "create item" form, and a
file upload flow. Reach for the base `Modal` when you need custom content in
a dialog; reach for one of the specialized ones when your dialog matches
that exact shape.

## Usage

```jsx
import { Modal, AuthModal, CreateModal, UploadDocumentModal } from '../../common'

// Base modal
<Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Confirm action">
  <p>Are you sure you want to continue?</p>
</Modal>

// Auth (login/signup)
<AuthModal
  isOpen={isAuthOpen}
  mode="login"
  onClose={() => setAuthOpen(false)}
  onSubmit={async (values) => signIn(values.email, values.password)}
  loginTitle="Sign in"
  loginDescription="Use your email and password to continue."
/>

// Create item
<CreateModal
  isOpen={isCreateOpen}
  title="Create document"
  fields={[{ name: 'title', label: 'Title', required: true }]}
  onClose={() => setCreateOpen(false)}
  onSubmit={(values) => createDocument(values)}
/>

// Upload document
<UploadDocumentModal
  isOpen={isUploadOpen}
  onClose={() => setUploadOpen(false)}
  onUpload={async (file) => uploadFile(file)}
/>
```

## Modal props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `isOpen` | boolean | `false` | Controls whether the modal is rendered/visible. |
| `title` | string | — | Title shown in the header. |
| `children` | node | — | Body content (ignored if `steps` or `Modal.Step` children are used). |
| `footer` | node | — | Custom footer. If omitted, a step footer is generated automatically when step content is present. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Dialog width. |
| `loading` | boolean | `false` | Shows a loading indicator in the body and disables close actions. |
| `preventClose` | boolean | `false` | Blocks backdrop click, Escape, and the close button from closing the modal. |
| `showCloseButton` | boolean | `true` | Shows/hides the header close (×) button. |
| `onClose` | function | — | Called when the modal is dismissed (backdrop, Escape, close button, or step dismiss). |
| `closeLabel` | string | `'Close dialog'` | Accessible label for the close button. |
| `steps` | array | `[]` | Step definitions (`{ title, description, content }`) for a wizard flow. Alternative to using `Modal.Step` children. |
| `currentStep` | number | `0` | Current step index (controlled). |
| `onStepChange` | function | — | Called with the next step index whenever the step changes (dots, next, back). |
| `onNext` | function | — | Called with the next index before advancing a step. |
| `onPrevious` | function | — | Called with the previous index before going back a step. |
| `onFinish` | function | — | Called when the final step's action button is pressed. |
| `dismissLabel` | string | `'Dismiss'` | Label for the dismiss button shown on the first step (calls `onClose`) in a step flow. |
| `backLabel` | string | `'Back'` | Label for the previous-step button. |
| `nextLabel` | string | `'Next'` | Label for the next-step button. |
| `finalActionLabel` | string | `'Get Started'` | Label for the final step's action button. |
| `showStepDots` | boolean | `true` | Shows step-progress dots. |
| `allowDotNavigation` | boolean | `true` | Allows clicking a dot to jump to that step. |
| `className` | string | `''` | Extra class name(s) applied to the dialog element. |

Use `<Modal.Step title="..." description="...">...</Modal.Step>` children as an
alternative to the `steps` array — both produce the same wizard footer.

## AuthModal props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `isOpen` | boolean | `false` | Controls visibility. |
| `open` | boolean | — | Alternate visibility prop; takes precedence over `isOpen` when set. |
| `mode` | `'login' \| 'signup'` | `'login'` | Initial mode (resets whenever the modal opens). |
| `onClose` | function | — | Called when the modal closes. |
| `onSubmit` | function | — | Called after validation passes with `{ mode, name, email, password, confirmPassword }`. |
| `onGoogleSignIn` | function | — | Called with the active mode when "Continue with Google" is pressed. |
| `brand` | node | — | Brand/logo shown in the promo panel. |
| `promoEyebrow` | string | — | Small label above the promo title. |
| `loginPromoTitle` / `signupPromoTitle` | string | — | Promo heading per mode. |
| `loginPromoText` / `signupPromoText` | string | — | Promo body copy per mode. |
| `formEyebrow` | string | — | Small label above the form heading. |
| `loginTitle` / `signupTitle` | string | — | Form heading per mode. |
| `loginDescription` / `signupDescription` | string | — | Form intro text per mode. |
| `promoFoot` | string | — | Small text at the bottom of the promo panel. |

**Notes:** Email is required and validated with a basic pattern; password
must be 6+ characters; signup additionally requires a name and a matching
confirm-password. Errors are shown inline per field. Switching between
login/signup (via the in-modal link) resets the form.

## CreateModal props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `isOpen` | boolean | — | Visibility flag. |
| `open` | boolean | — | Alternate visibility flag; takes precedence over `isOpen` when set. |
| `title` | string | `'Create item'` | Modal title. |
| `description` | string | — | Intro paragraph under the title. |
| `fields` | array | `[]` | Field definitions — see below. |
| `submitText` | string | `'Create'` | Submit button label. |
| `cancelText` | string | `'Cancel'` | Cancel button label. |
| `onClose` | function | — | Called when the user cancels/closes. |
| `onSubmit` | function | — | Called with the form values once validation passes. |
| `eyebrow` | string | — | Small label above the description. |
| `savingText` | string | `'Saving...'` | Submit button label while `onSubmit` is pending. |

Each entry in `fields` supports: `name` (required), `label`, `type`
(`text` | `textarea` | `select` | `checkbox`, default `text`), `placeholder`,
`required`, `defaultValue`, `disabled`, `rows` (for `textarea`), `options`
(for `select`), `validate(value, values)` returning an error string or
falsy, and `render({ field, value, onChange, disabled })` to fully replace
the rendered control.

## UploadDocumentModal props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `isOpen` | boolean | — | Visibility flag. |
| `open` | boolean | — | Alternate visibility flag; takes precedence over `isOpen` when set. |
| `title` | string | `'Upload document'` | Modal title. |
| `description` | string | `'Add a file to keep your workspace organized.'` | Intro text. |
| `eyebrow` | string | — | Small label above the description. |
| `dropText` | string | `'Drop a file here'` | Primary text in the drop zone (no file selected). |
| `browseText` | string | `'or click to browse from your device'` | Secondary help text in the drop zone. |
| `uploadText` | string | `'Upload'` | Submit button label when idle. |
| `uploadingText` | string | `'Uploading...'` | Submit button label while uploading. |
| `noFileMessage` | string | `'Choose a file to upload.'` | Error shown when submitting with no file selected. |
| `fileTypesText` | string | — | Optional label describing accepted file types. |
| `accept` | string | `'.pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg'` | Passed to the file input's `accept`. |
| `maxSize` | number | `10 * 1024 * 1024` | Max file size in bytes; larger files are rejected with an inline error. |
| `onClose` | function | — | Called when the modal closes. |
| `onUpload` | function | — | Called with the selected `File` once submitted. |

**Notes:** Supports both click-to-browse and drag-and-drop onto the same
drop zone. The upload button is disabled while `onUpload` is pending.

## Files

`Modal.css` styles the base dialog (shared by all four components).
`AuthModal.css` and `DataModals.css` (used by both `CreateModal` and
`UploadDocumentModal`) layer on top of it. All classes are prefixed
(`modal__*`, `auth-modal__*`, `data-modal__*`) to avoid colliding with a
host app's CSS.
