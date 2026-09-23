import { useState } from 'react'
import Login from '../../common/Login/Login'
import './LoginPage.css'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [lastSubmitted, setLastSubmitted] = useState(null)

  function handleSubmit({ email, password, rememberMe }) {
    setError('')
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      if (password.length < 6) {
        setError('Incorrect email or password.')
        return
      }
      setLastSubmitted({ email, rememberMe })
    }, 700)
  }

  return (
    <div className="login-page">
      <div className="page-heading">
        <p className="eyebrow">Common / Login</p>
        <h1>Login</h1>
        <p>Self-contained login form with validation, loading and error states.</p>
      </div>

      {lastSubmitted ? (
        <p className="login-page__result">
          Signed in as <strong>{lastSubmitted.email}</strong>
          {lastSubmitted.rememberMe ? ' (remember me checked)' : ''}.
        </p>
      ) : (
        <p className="login-page__result login-page__result--hint">
          Try submitting with a password under 6 characters to see the error state.
        </p>
      )}

      <div className="login-page__frame">
        <Login
          appName="PlansStudio"
          appLogo="PS"
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
          showSignUp
          onForgotPassword={() => window.alert('Forgot password clicked')}
          onSignUp={() => window.alert('Sign up clicked')}
        />
      </div>
    </div>
  )
}
