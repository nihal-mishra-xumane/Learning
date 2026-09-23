# Component Usage Guide

This project contains reusable UI components under the `src/common` folder. Each component is intentionally presentational and expects the page or parent screen to provide the data, state, and business logic.

The examples in this guide show the real props exposed by the code in this project.

---

## 1) StatusBadge

### Import

```jsx
import StatusBadge from './src/common/StatusBadges/StatusBadge'
```

### Purpose

Displays a small badge with a colored dot and label for statuses like `neutral`, `success`, `warning`, or `danger`.

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `status` | `string` | `'neutral'` | Status key used to resolve a style and label from `statusConfig`. |
| `label` | `string` | resolved from `statusConfig` | Custom text displayed inside the badge. |
| `statusConfig` | `object` | built-in default config | Map of status keys to `{ label, tone }` objects. |
| `tone` | `string` | resolved from `statusConfig` | Optional override to force the badge color. |
| `dot` | `boolean` | `true` | Shows or hides the colored dot before the label. |

### Default config

```jsx
const defaultStatusConfig = {
  neutral: { label: 'Neutral', tone: 'neutral' },
  info: { label: 'Information', tone: 'info' },
  success: { label: 'Success', tone: 'success' },
  warning: { label: 'Warning', tone: 'warning' },
  danger: { label: 'Danger', tone: 'danger' },
}
```

### Example

```jsx
const reviewStatuses = {
  draft: { label: 'Draft', tone: 'neutral' },
  approved: { label: 'Approved', tone: 'success' },
  rejected: { label: 'Rejected', tone: 'danger' },
}

<StatusBadge status="approved" statusConfig={reviewStatuses} />
<StatusBadge status="draft" label="In review" dot={false} />
```

---

## 2) Tabs

### Import

```jsx
import Tabs from './src/common/Tabs/Tabs'
```

### Purpose

Displays a horizontal tab list with keyboard accessibility and an active indicator.

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `tabs` | `Array<object>` | `[]` | Array of tab definitions. Each tab supports `id`, `label`, and optional `icon`, `count`, and `disabled`. |
| `activeTab` | `string` | `undefined` | The currently selected tab ID. |
| `onChange` | `function` | `undefined` | Callback fired when a tab is selected. Receives the tab `id` value. |
| `variant` | `'underline'` | `'underline'` | Visual style variant for the tab list. |

### Tab object shape

```jsx
{
  id: 'overview',
  label: 'Overview',
  icon: <Icon />,
  count: 3,
  disabled: false,
}
```

### Example

```jsx
import { useState } from 'react'
import Tabs from './src/common/Tabs/Tabs'

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'documents', label: 'Documents', count: 8 },
  { id: 'settings', label: 'Settings', disabled: true },
]

function ExamplePage() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <Tabs
      tabs={tabs}
      activeTab={activeTab}
      onChange={setActiveTab}
      variant="underline"
    />
  )
}
```

### Behavior notes

- Tabs are keyboard navigable with arrow keys, `Home`, and `End`.
- Disabled tabs are skipped in focus order.
- The selected tab indicator is automatically positioned based on the active tab element.

---

## 3) Modal

### Import

```jsx
import Modal from './src/common/Modals/Modal'
```

### Purpose

Renders a reusable dialog/modal with backdrop, focus management, Escape-to-close behavior, and optional step flow.

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `isOpen` | `boolean` | `false` | Controls whether the modal is displayed. |
| `title` | `string` | `undefined` | Title displayed in the modal header. |
| `children` | `ReactNode` | `undefined` | Main content inside the modal body. |
| `footer` | `ReactNode` | `undefined` | Optional custom footer content. If omitted, step flow footer is generated automatically. |
| `size` | `'small' | 'medium' | 'large'` | `'medium'` | Width of the modal dialog. |
| `loading` | `boolean` | `false` | Shows a loading state and disables some close actions. |
| `preventClose` | `boolean` | `false` | Stops backdrop, Escape key, and close button from closing the modal. |
| `showCloseButton` | `boolean` | `true` | Shows or hide the close button. |
| `onClose` | `function` | `undefined` | Called when the modal is dismissed. |
| `closeLabel` | `string` | `'Close dialog'` | Accessible label for the close button. |
| `steps` | `Array<object>` | `[]` | Step config array used when displaying sequential wizard content. |
| `currentStep` | `number` | `0` | Current step index for step-based modals. |
| `onStepChange` | `function` | `undefined` | Called when a step is changed. Receives the next step index. |
| `onNext` | `function` | `undefined` | Called before moving to the next step. Receives the next step index. |
| `onPrevious` | `function` | `undefined` | Called before moving to the previous step. Receives the previous step index. |
| `onFinish` | `function` | `undefined` | Called when the last step finishes. |
| `dismissLabel` | `string` | `'Dismiss'` | Label used for the dismiss action when displayed in step flows. |
| `backLabel` | `string` | `'Back'` | Label for the previous-step button. |
| `nextLabel` | `string` | `'Next'` | Label for the next-step button. |
| `finalActionLabel` | `string` | `'Get Started'` | Label for the final step action button. |
| `showStepDots` | `boolean` | `true` | Displays step-progress dots for multi-step content. |
| `allowDotNavigation` | `boolean` | `true` | Enables clicking step dots to jump to a different step. |
| `className` | `string` | `''` | Extra CSS class names applied to the dialog wrapper. |

### Step content pattern

You can pass step content either as child components or through the `steps` prop.

```jsx
import Modal from './src/common/Modals/Modal'

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Create workspace"
  size="medium"
  steps={[
    { title: 'Workspace info', content: <input placeholder="Workspace name" /> },
    { title: 'Confirm', content: <p>Review and confirm.</p> },
  ]}
  currentStep={currentStep}
  onStepChange={setCurrentStep}
  onFinish={() => console.log('done')}
/>
```

You can also use `ModalStep` children:

```jsx
<Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Wizard">
  <ModalStep title="Step 1">First screen</ModalStep>
  <ModalStep title="Step 2">Second screen</ModalStep>
</Modal>
```

> The component handles focus trapping, Escape-to-close, and body scroll locking automatically.

---

## 4) AuthModal

### Import

```jsx
import AuthModal from './src/common/Modals/AuthModal'
```

### Purpose

Renders a login/signup modal using the shared `Modal` base.

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `isOpen` | `boolean` | `false` | Controls modal visibility. |
| `open` | `boolean` | `undefined` | Alternate visibility prop; it takes precedence when provided. |
| `mode` | `'login' | 'signup'` | `'login'` | Initial auth mode. |
| `onClose` | `function` | `undefined` | Called when the modal is closed. |
| `onSubmit` | `function` | `undefined` | Called after validation passes; receives `{ mode, name, email, password, confirmPassword }`. |
| `onGoogleSignIn` | `function` | `undefined` | Called when the Google sign-in button is pressed. Receives the active mode. |
| `brand` | `ReactNode` | `undefined` | Brand text/logo shown in the promo area. |
| `promoEyebrow` | `string` | `undefined` | Small eyebrow label above the promo title. |
| `loginPromoTitle` | `string` | `undefined` | Promo title shown in login mode. |
| `signupPromoTitle` | `string` | `undefined` | Promo title shown in signup mode. |
| `loginPromoText` | `string` | `undefined` | Promo description in login mode. |
| `signupPromoText` | `string` | `undefined` | Promo description in signup mode. |
| `formEyebrow` | `string` | `undefined` | Label above the form heading. |
| `loginTitle` | `string` | `undefined` | Form heading for login mode. |
| `signupTitle` | `string` | `undefined` | Form heading for signup mode. |
| `loginDescription` | `string` | `undefined` | Intro text for login mode. |
| `signupDescription` | `string` | `undefined` | Intro text for signup mode. |
| `promoFoot` | `string` | `undefined` | Secondary text at the bottom of the promo panel. |

### Validation behavior

- Email must be present and valid.
- Password must be at least 6 characters long.
- Signup requires a name and matching confirm-password input.
- On submit, validation errors are displayed inline.

### Example

```jsx
<AuthModal
  isOpen={isAuthOpen}
  mode="login"
  onClose={() => setAuthOpen(false)}
  onSubmit={async (values) => {
    await signIn(values.email, values.password)
  }}
  onGoogleSignIn={(mode) => console.log('Google sign in', mode)}
  brand="Xumane"
  promoEyebrow="Welcome back"
  loginPromoTitle="Grow with confidence"
  loginPromoText="Access your workspace and continue learning."
  signupPromoTitle="Create your account"
  signupPromoText="Start building a personalized learning journey."
  formEyebrow="Member access"
  loginTitle="Sign in"
  signupTitle="Create account"
  loginDescription="Use your email and password to continue."
  signupDescription="Create an account to save progress and unlock tools."
  promoFoot="Secure learning platform"
/>
```

---

## 5) CreateModal

### Import

```jsx
import CreateModal from './src/common/Modals/CreateModal'
```

### Purpose

Creates a generic form modal for adding an item. It generates fields from a definition array and validates them before calling `onSubmit`.

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | `undefined` | Alternate visibility flag; used when provided. |
| `isOpen` | `boolean` | `undefined` | Visibility flag for the modal. |
| `title` | `string` | `'Create item'` | Modal title. |
| `description` | `string` | `undefined` | Intro paragraph under the title. |
| `fields` | `Array<object>` | `[]` | Field config objects that define the form. |
| `submitText` | `string` | `'Create'` | Submit button label. |
| `cancelText` | `string` | `'Cancel'` | Cancel button label. |
| `onClose` | `function` | `undefined` | Called when the user exits the modal. |
| `onSubmit` | `function` | `undefined` | Called with the final form values after validation passes. |
| `eyebrow` | `string` | `undefined` | Small label above the description. |
| `savingText` | `string` | `'Saving...'` | Label shown while form submission is in progress. |

### Field config object

```jsx
{
  name: 'title',
  label: 'Title',
  type: 'text',
  placeholder: 'Enter the title',
  required: true,
  defaultValue: '',
  disabled: false,
  validate: (value, values) => {
    if (!value) return 'Title is required.'
    return null
  },
  render: ({ field, value, onChange, disabled }) => <input />,
  options: [
    { value: 'a', label: 'A' },
    { value: 'b', label: 'B' },
  ],
  rows: 4,
}
```

### Supported field types

- `text`
- `textarea`
- `select`
- `checkbox`
- any other value falls back to a text input

### Example

```jsx
<CreateModal
  isOpen={isCreateOpen}
  title="Create document"
  description="Add a new document to the workspace."
  eyebrow="Library"
  fields={[
    {
      name: 'title',
      label: 'Title',
      required: true,
      placeholder: 'My new document',
    },
    {
      name: 'category',
      label: 'Category',
      type: 'select',
      placeholder: 'Choose a category',
      required: true,
      options: [
        { value: 'guide', label: 'Guide' },
        { value: 'course', label: 'Course' },
      ],
    },
    {
      name: 'notes',
      label: 'Notes',
      type: 'textarea',
      rows: 4,
    },
  ]}
  onClose={() => setCreateOpen(false)}
  onSubmit={(values) => createDocument(values)}
/>
```

---

## 6) UploadDocumentModal

### Import

```jsx
import UploadDocumentModal from './src/common/Modals/UploadDocumentModal'
```

### Purpose

Handles file upload through a draggable drop zone and a file input.

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | `undefined` | Alternate open flag. |
| `isOpen` | `boolean` | `undefined` | Visibility flag for the modal. |
| `title` | `string` | `'Upload document'` | Modal header title. |
| `description` | `string` | `'Add a file to keep your workspace organized.'` | Intro text. |
| `eyebrow` | `string` | `undefined` | Small label above the description. |
| `dropText` | `string` | `'Drop a file here'` | Primary text inside the upload zone when no file is selected. |
| `browseText` | `string` | `'or click to browse from your device'` | Secondary help text in the upload zone. |
| `uploadText` | `string` | `'Upload'` | Submit button label when idle. |
| `uploadingText` | `string` | `'Uploading...'` | Label shown while the upload is in progress. |
| `noFileMessage` | `string` | `'Choose a file to upload.'` | Error text shown when user tries to upload with no selected file. |
| `fileTypesText` | `string` | `undefined` | Optional label showing acceptable file types. |
| `accept` | `string` | `'.pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg'` | Accepted MIME/file extensions passed to the file input. |
| `maxSize` | `number` | `10 * 1024 * 1024` | Maximum allowed file size in bytes. |
| `onClose` | `function` | `undefined` | Called when the modal is closed. |
| `onUpload` | `function` | `undefined` | Called with the selected file once the form is submitted. |

### Example

```jsx
<UploadDocumentModal
  isOpen={isUploadModalOpen}
  title="Upload learning material"
  description="Add a PDF or image to your course library."
  fileTypesText="PDF, DOCX, PNG"
  maxSize={5 * 1024 * 1024}
  onClose={() => setUploadModalOpen(false)}
  onUpload={async (file) => {
    await uploadFile(file)
    setUploadModalOpen(false)
  }}
/>
```

### Behavior notes

- Files larger than `maxSize` are rejected with an inline error.
- Drag-and-drop is supported.
- Upload button stays disabled while the file is being processed.

---

## 7) Notification

### Import

```jsx
import Notification from './src/common/Notifications/Notification'
```

### Purpose

Displays a single inline/stacked toast-style alert with icon, title, message, and optional actions.

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `'success' | 'error' | 'warning' | 'info'` | `'info'` | Semantic alert type. Invalid values fallback to `info`. |
| `message` | `ReactNode` | `undefined` | Main message content for the notification. |
| `title` | `string` | `undefined` | Optional heading shown above the message. |
| `description` | `string` | `undefined` | Optional longer descriptive text. If provided, it is rendered instead of the short `message`. |
| `icon` | `ReactNode` | built-in icon for the type | Custom icon override. |
| `actions` | `Array<object>` | `[]` | Action buttons rendered beneath the notification content. |
| `theme` | `'light' | 'dark'` | `'light'` | Theme variant for the notification. |
| `duration` | `number` | `4000` | Auto-dismiss time in milliseconds. Set to `0` to disable auto-dismiss. |
| `onClose` | `function` | `undefined` | Called when the notification is dismissed. |
| `position` | `'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'` | `'top-right'` | Visual position of the notification. |

### Action object shape

```jsx
{
  id: 'retry-action',
  label: 'Retry',
  variant: 'primary',
  onClick: (dismiss) => {
    // handle retry
    dismiss()
  },
}
```

### Example

```jsx
<Notification
  type="success"
  title="Changes saved"
  description="Your updates were successfully published."
  duration={4000}
  onClose={() => setToast(null)}
  actions={[
    {
      id: 'view-action',
      label: 'View',
      variant: 'primary',
      onClick: () => navigate('/updates'),
    },
  ]}
/>
```

---

## 8) NotificationPanel

### Import

```jsx
import NotificationPanel from './src/common/Notifications/NotificationPanel'
```

### Purpose

Displays a notification inbox/side panel with unread state, summary data, and optional actions.

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | `false` | Controls whether the panel is visible. |
| `notifications` | `Array<object>` | `[]` | The list of inbox items. |
| `onClose` | `function` | `undefined` | Called when the panel closes. |
| `onMarkAllRead` | `function` | `undefined` | Called when the user marks all notifications as read. |
| `onNotificationClick` | `function` | `undefined` | Called when a notification row is clicked. Receives the clicked notification item. |
| `title` | `string` | `'Notifications'` | Panel title. |
| `markAllLabel` | `string` | `'All read'` | Label on the header action that marks all items as read. |
| `emptyMessage` | `string` | `'You are all caught up.'` | Text displayed when `notifications` is empty. |
| `id` | `string` | `'notification-panel'` | HTML id attribute for the panel. |

### Notification item shape

```jsx
{
  id: 'n-1',
  name: 'John Doe',
  summary: 'Commented on your lesson',
  preview: 'Nice update — I think this section is clearer now.',
  time: '2 min ago',
  dateTime: '2026-09-21T12:00:00Z',
  avatar: 'https://example.com/avatar.png',
  read: false,
  actions: [
    {
      id: 'accept',
      label: 'Accept',
      variant: 'primary',
      onClick: (notification) => console.log('accepted', notification),
    },
  ],
}
```

### Example

```jsx
<NotificationPanel
  open={panelOpen}
  title="Inbox"
  notifications={notifications}
  onClose={() => setPanelOpen(false)}
  onMarkAllRead={() => markAllAsRead()}
  onNotificationClick={(notification) => openDetails(notification)}
/>
```

### Behavior notes

- The panel listens for `Escape` and clicks outside to dismiss.
- The unread count is derived from `notifications.filter((n) => !n.read).length`.
- A panel item can include custom action buttons per notification.

---

## General usage pattern

These components follow a consistent pattern:

1. Parent screens own state and data.
2. Components receive values through props.
3. Components emit user actions through callbacks such as `onChange`, `onSubmit`, `onClose`, and `onUpload`.
4. The page determines validation, API calls, and business rules.

This keeps the UI shared and the logic reusable across the app.

---

## Quick import summary

```jsx
import StatusBadge from './src/common/StatusBadges/StatusBadge'
import Tabs from './src/common/Tabs/Tabs'
import Modal from './src/common/Modals/Modal'
import AuthModal from './src/common/Modals/AuthModal'
import CreateModal from './src/common/Modals/CreateModal'
import UploadDocumentModal from './src/common/Modals/UploadDocumentModal'
import Notification from './src/common/Notifications/Notification'
import NotificationPanel from './src/common/Notifications/NotificationPanel'
```

If you want, you can also add a small example page under the project to showcase these components together in a demo screen.
