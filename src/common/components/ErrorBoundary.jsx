import { Component } from 'react'

/**
 * Catches render errors so a broken screen degrades into a readable message
 * instead of a blank page.
 *
 * `fallback` can be a node or a function receiving `{ error, reset }`, and
 * `onError` lets the host app forward the error to its own logging - this
 * component deliberately knows nothing about which logger you use.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
    this.reset = this.reset.bind(this)
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    this.props.onError?.(error, info)
  }

  reset() {
    this.setState({ error: null })
  }

  render() {
    const { error } = this.state
    const { children, fallback, title = 'Something went wrong' } = this.props

    if (!error) return children

    if (fallback) {
      return typeof fallback === 'function' ? fallback({ error, reset: this.reset }) : fallback
    }

    return (
      <div className="ui-card" role="alert">
        <div className="ui-card-body ui-stack">
          <h2 className="ui-title-sm">{title}</h2>
          <p className="ui-text-secondary">
            This section could not be displayed. The rest of the app is still usable.
          </p>
          {import.meta.env?.DEV ? <pre className="ui-text-muted">{String(error?.message || error)}</pre> : null}
          <div>
            <button type="button" className="ui-btn ui-btn-secondary" onClick={this.reset}>
              Try again
            </button>
          </div>
        </div>
      </div>
    )
  }
}
