# Login

Self-contained login form: email/password fields, client-side validation,
a loading/submitting state, a server-error slot, remember-me, and optional
forgot-password / sign-up hooks. Built entirely on the existing `Input`,
`Checkbox` and `Button` components — copy the whole `Login/` folder (plus the
`Forms/` and `Buttons/` folders it depends on) into another project and it
works unchanged.

## Usage

```jsx
import Login from '../../common/Login/Login'

function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit({ email, password, rememberMe }) {
    setError('')
    setLoading(true)
    try {
      await signIn(email, password, rememberMe)
    } catch (err) {
      setError('Incorrect email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Login
      appName="Procurement Portal"
      appLogo="PR"
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
      showSignUp
      onForgotPassword={() => navigate('/forgot-password')}
      onSignUp={() => navigate('/sign-up')}
    />
  )
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `appName` | string | `"Application"` | Used in the default subtitle text ("Enter your details to access X"). |
| `appLogo` | string \| node | — | Rendered in the logo mark above the title. A short string (e.g. `"PS"`) or any React node. |
| `title` | string | `"Sign in"` | Form heading. |
| `subtitle` | string | `Enter your details to access ${appName}.` | Text under the heading. Pass `""` to hide it. |
| `emailLabel` / `passwordLabel` | string | `"Email"` / `"Password"` | Field labels. |
| `submitLabel` | string | `"Sign in"` | Submit button text. |
| `showRememberMe` | boolean | `true` | Show the remember-me checkbox. |
| `rememberMeLabel` | string | `"Remember me"` | Label for that checkbox. |
| `showForgotPassword` | boolean | `true` | Show the forgot-password link. |
| `forgotPasswordLabel` | string | `"Forgot password?"` | Text for that link. |
| `onForgotPassword` | `() => void` | — | Called when the forgot-password link is clicked. |
| `showSignUp` | boolean | `false` | Show the sign-up prompt below the submit button. |
| `signUpPrompt` | string | `"Don't have an account?"` | Text before the sign-up action. |
| `signUpActionLabel` | string | `"Create one"` | Text of the sign-up action. |
| `onSignUp` | `() => void` | — | Called when the sign-up action is clicked. |
| `onSubmit` | `({ email, password, rememberMe }) => void` | — | Called only after client-side validation passes. |
| `loading` | boolean | `false` | Disables the fields/links and shows a spinner on the submit button. |
| `error` | string | — | Server-side error banner shown above the fields (e.g. "Incorrect email or password."). |
| `className` | string | `""` | Extra class on the root wrapper. |
| `children` | node | — | Rendered between the submit button and the sign-up prompt (e.g. an SSO button or a divider). |

## Notes

- Validation is intentionally minimal and client-side only: required fields
  and an email-format check. Server-side/auth failures should be surfaced
  through the `error` prop, not invented as new client rules.
- Login owns no auth logic (no token storage, no redirect, no API call) —
  that's entirely the host app's responsibility inside `onSubmit`.
- The outer `.common-login` wrapper centers the card and fills available
  height (`min-height: 100%`); give its parent container an explicit height
  (e.g. a full-page route) for the centering to take effect.
