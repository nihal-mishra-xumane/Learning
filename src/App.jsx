import { useState } from 'react'
import { ErrorBoundary } from './common/components'
import { ThemeToggle } from './common/theme'
import ThemeConfigPage from './pages/Theme/ThemeConfigPage'

const pages = [
  'Login',
  'Header',
  'Sidebar',
  'Theme',
  'Buttons',
  'Tables',
  'Forms',
  'Filters',
  'Search',
  'Tabs',
  'Status badges',
]

export default function App() {
  const [activePage, setActivePage] = useState('Theme')

  return (
    <div className="app-shell">
      <a className="ui-skip-link" href="#main-content">
        Skip to content
      </a>

      <header className="app-header">
        <strong className="app-brand">Airtecture</strong>
        <ThemeToggle iconOnly label="Colour theme" />
      </header>

      <div className="app-body">
        <nav className="navigation" aria-label="Pages">
          {pages.map((page) => (
            <button
              key={page}
              type="button"
              className={activePage === page ? 'active' : ''}
              aria-current={activePage === page ? 'page' : undefined}
              onClick={() => setActivePage(page)}
            >
              {page}
            </button>
          ))}
        </nav>

        <main className="content" id="main-content" tabIndex={-1}>
          <div className="content-inner">
            <ErrorBoundary key={activePage}>
              {activePage === 'Theme' ? (
                <ThemeConfigPage />
              ) : (
                <div className="ui-empty">
                  <p className="ui-text-secondary">{activePage} has not been built yet.</p>
                  <p className="ui-text-muted">
                    It will reuse the components and tokens from the Theme page - no new colours or
                    sizes.
                  </p>
                </div>
              )}
            </ErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  )
}
