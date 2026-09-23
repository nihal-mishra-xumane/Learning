import { useEffect, useState } from 'react'
import Modal from './Modal'
import './AuthModal.css'

const initialValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
}

function validateForm(mode, values) {
  const errors = {}

  if (mode === 'signup' && !values.name.trim()) {
    errors.name = 'Enter your name.'
  }

  if (!values.email.trim()) {
    errors.email = 'Enter your email address.'
  } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
    errors.email = 'Enter a valid email address.'
  }

  if (!values.password) {
    errors.password = 'Enter your password.'
  } else if (values.password.length < 6) {
    errors.password = 'Use at least 6 characters.'
  }

  if (mode === 'signup' && values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.'
  }

  return errors
}

export default function AuthModal({
  isOpen = false,
  open,
  mode: initialMode = 'login',
  onClose,
  onSubmit,
  onGoogleSignIn,
    brand,
    promoEyebrow,
    loginPromoTitle,
    signupPromoTitle,
    loginPromoText,
    signupPromoText,
    formEyebrow,
    loginTitle,
    signupTitle,
    loginDescription,
    signupDescription,
    promoFoot,
}) {
  const [mode, setMode] = useState(initialMode)
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const visible = open ?? isOpen
  const isSignup = mode === 'signup'

  useEffect(() => {
    if (!visible) return
    setMode(initialMode)
    setValues(initialValues)
    setErrors({})
    setShowPassword(false)
    setShowConfirmPassword(false)
    setIsSubmitting(false)
  }, [initialMode, visible])

  const switchMode = () => {
    setMode((currentMode) => (currentMode === 'login' ? 'signup' : 'login'))
    setValues(initialValues)
    setErrors({})
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setValues((currentValues) => ({ ...currentValues, [name]: value }))
    setErrors((currentErrors) => ({ ...currentErrors, [name]: '' }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = validateForm(mode, values)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) return

    setIsSubmitting(true)
    try {
      await onSubmit?.({ mode, ...values })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleSignIn = () => {
    onGoogleSignIn?.(mode)
  }

  const fieldError = (fieldName) => errors[fieldName]

  return (
    <Modal
      isOpen={visible}
      onClose={onClose}
      size="large"
      title=""
      closeLabel="Close authentication dialog"
      className="modal__dialog--auth"
    >
      <div className="auth-modal">
        <aside className="auth-modal__promo" aria-label="Platform benefits">
            {brand && <div className="auth-modal__brand">{brand}</div>}
          <div className="auth-modal__promo-copy">
              {promoEyebrow && <span className="auth-modal__eyebrow">{promoEyebrow}</span>}
              <h2>{isSignup ? signupPromoTitle : loginPromoTitle}</h2>
              <p>{isSignup ? signupPromoText : loginPromoText}</p>
          </div>
          <div className="auth-modal__illustration" aria-hidden="true">
            <span className="auth-modal__illustration-card auth-modal__illustration-card--back" />
            <span className="auth-modal__illustration-card auth-modal__illustration-card--front">
              <span />
              <span />
              <span />
            </span>
            <span className="auth-modal__illustration-orb" />
          </div>
          {promoFoot && <p className="auth-modal__promo-foot">{promoFoot}</p>}
        </aside>

        <section className="auth-modal__form-panel" aria-labelledby="auth-modal-title">
          <div className="auth-modal__heading">
              {formEyebrow && <span className="auth-modal__eyebrow">{formEyebrow}</span>}
              <h2 id="auth-modal-title">{isSignup ? signupTitle : loginTitle}</h2>
              <p>{isSignup ? signupDescription : loginDescription}</p>
          </div>

          <form className="auth-modal__form" onSubmit={handleSubmit} noValidate>
            {isSignup && (
              <label className="auth-modal__field">
                <span>Full name</span>
                <input name="name" value={values.name} onChange={handleChange} autoComplete="name" aria-invalid={Boolean(fieldError('name'))} />
                {fieldError('name') && <small>{fieldError('name')}</small>}
              </label>
            )}

            <label className="auth-modal__field">
              <span>Email address</span>
              <input type="email" name="email" value={values.email} onChange={handleChange} autoComplete="email" aria-invalid={Boolean(fieldError('email'))} />
              {fieldError('email') && <small>{fieldError('email')}</small>}
            </label>

            <label className="auth-modal__field">
              <span>Password</span>
              <span className="auth-modal__input-wrap">
                <input type={showPassword ? 'text' : 'password'} name="password" value={values.password} onChange={handleChange} autoComplete={isSignup ? 'new-password' : 'current-password'} aria-invalid={Boolean(fieldError('password'))} />
                <button type="button" className="auth-modal__toggle" onClick={() => setShowPassword((visiblePassword) => !visiblePassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </span>
              {fieldError('password') && <small>{fieldError('password')}</small>}
            </label>

            {isSignup && (
              <label className="auth-modal__field">
                <span>Confirm password</span>
                <span className="auth-modal__input-wrap">
                  <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={values.confirmPassword} onChange={handleChange} autoComplete="new-password" aria-invalid={Boolean(fieldError('confirmPassword'))} />
                  <button type="button" className="auth-modal__toggle" onClick={() => setShowConfirmPassword((visiblePassword) => !visiblePassword)} aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}>
                    {showConfirmPassword ? 'Hide' : 'Show'}
                  </button>
                </span>
                {fieldError('confirmPassword') && <small>{fieldError('confirmPassword')}</small>}
              </label>
            )}

            {!isSignup && <button type="button" className="auth-modal__forgot">Forgot password?</button>}

            <button type="submit" className="auth-modal__submit" disabled={isSubmitting}>
              {isSubmitting ? 'Please wait...' : isSignup ? 'Create account' : 'Sign in'}
            </button>
          </form>

          <div className="auth-modal__divider"><span>OR</span></div>

          <button type="button" className="auth-modal__google" onClick={handleGoogleSignIn}>
            <span className="auth-modal__google-icon" aria-hidden="true">G</span>
            Continue with Google
          </button>

          <p className="auth-modal__switch">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button type="button" onClick={switchMode}>{isSignup ? 'Sign in' : 'Sign up'}</button>
          </p>
        </section>
      </div>
    </Modal>
  )
}
