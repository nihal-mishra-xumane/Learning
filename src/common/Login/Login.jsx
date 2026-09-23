import { useId, useState } from 'react'
import Button from '../Buttons/Button'
import Checkbox from '../Forms/Checkbox'
import Input from '../Forms/Input'
import './Login.css'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate({ email, password }) {
  const errors = {}
  if (!email.trim()) errors.email = 'Email is required.'
  else if (!EMAIL_PATTERN.test(email.trim())) errors.email = 'Enter a valid email address.'
  if (!password) errors.password = 'Password is required.'
  return errors
}

export default function Login({
  appName = 'Application',
  appLogo,
  title = 'Sign in',
  subtitle = `Enter your details to access ${appName}.`,
  emailLabel = 'Email',
  passwordLabel = 'Password',
  submitLabel = 'Sign in',
  showRememberMe = true,
  rememberMeLabel = 'Remember me',
  showForgotPassword = true,
  forgotPasswordLabel = 'Forgot password?',
  onForgotPassword,
  showSignUp = false,
  signUpPrompt = "Don't have an account?",
  signUpActionLabel = 'Create one',
  onSignUp,
  onSubmit,
  loading = false,
  error,
  className = '',
  children,
}) {
  const formId = useId()
  const [values, setValues] = useState({ email: '', password: '', rememberMe: false })
  const [fieldErrors, setFieldErrors] = useState({})
  const [touched, setTouched] = useState({})

  function updateField(field, value) {
    setValues((current) => ({ ...current, [field]: value }))
    if (fieldErrors[field]) setFieldErrors((current) => ({ ...current, [field]: undefined }))
  }

  function handleBlur(field) {
    setTouched((current) => ({ ...current, [field]: true }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const errors = validate(values)
    setFieldErrors(errors)
    setTouched({ email: true, password: true })
    if (Object.keys(errors).length === 0) onSubmit?.(values)
  }

  return (
    <div className={`common-login ${className}`.trim()}>
      <form className="common-login__card" onSubmit={handleSubmit} noValidate aria-labelledby={`${formId}-title`}>
        <div className="common-login__brand">
          {appLogo ? (
            typeof appLogo === 'string'
              ? <span className="common-login__logo" aria-hidden="true">{appLogo}</span>
              : appLogo
          ) : null}
        </div>

        <h1 className="common-login__title" id={`${formId}-title`}>{title}</h1>
        {subtitle ? <p className="common-login__subtitle">{subtitle}</p> : null}

        {error ? <p className="common-login__error" role="alert">{error}</p> : null}

        <div className="common-login__fields">
          <Input
            label={emailLabel}
            type="email"
            autoComplete="email"
            required
            fullWidth
            value={values.email}
            onChange={(event) => updateField('email', event.target.value)}
            onBlur={() => handleBlur('email')}
            error={Boolean(touched.email && fieldErrors.email)}
            errorMessage={fieldErrors.email}
            disabled={loading}
          />

          <Input
            label={passwordLabel}
            type="password"
            autoComplete="current-password"
            required
            fullWidth
            showPasswordToggle
            value={values.password}
            onChange={(event) => updateField('password', event.target.value)}
            onBlur={() => handleBlur('password')}
            error={Boolean(touched.password && fieldErrors.password)}
            errorMessage={fieldErrors.password}
            disabled={loading}
          />
        </div>

        {(showRememberMe || showForgotPassword) && (
          <div className="common-login__row">
            {showRememberMe ? (
              <Checkbox
                label={rememberMeLabel}
                checked={values.rememberMe}
                onChange={(event) => updateField('rememberMe', event.target.checked)}
                disabled={loading}
              />
            ) : <span />}

            {showForgotPassword ? (
              <button type="button" className="common-login__link" onClick={onForgotPassword} disabled={loading}>
                {forgotPasswordLabel}
              </button>
            ) : null}
          </div>
        )}

        <Button type="submit" fullWidth loading={loading} loadingText="Signing in…">
          {submitLabel}
        </Button>

        {children}

        {showSignUp ? (
          <p className="common-login__signup">
            {signUpPrompt}{' '}
            <button type="button" className="common-login__link" onClick={onSignUp} disabled={loading}>
              {signUpActionLabel}
            </button>
          </p>
        ) : null}
      </form>
    </div>
  )
}
