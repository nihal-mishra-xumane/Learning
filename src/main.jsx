import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import ErrorBoundary from './common/components/ErrorBoundary'
import { ThemeProvider } from './common/theme'
import './styles.css'

// One provider at the root is what makes the theme universal: every screen and
// every shared component below reads the same tokens.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider storageKey="ui-theme">
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </ThemeProvider>
  </StrictMode>,
)
