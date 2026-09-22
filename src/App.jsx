import { useState } from 'react'
import ModalsPage from './pages/Modals/Modals'
import NotificationsPage from './pages/Notifications/Notifications'
import StatusBadgesPage from './pages/StatusBadges/StatusBadgesPage'
import TabsPage from './pages/Tabs/Tabs'

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
  'Modals',
  'Notifications',
  'Status badges',
]

export default function App() {
  const [activePage, setActivePage] = useState('Theme')

  const renderPage = () => {
    if (activePage === 'Modals') {
      return <ModalsPage />
    }

    if (activePage === 'Notifications') {
      return <NotificationsPage />
    }

    if (activePage === 'Tabs') {
      return <TabsPage />
    }

    if (activePage === 'Status badges') {
      return <StatusBadgesPage />
    }

    return (
      <>
        <p>Page content will be displayed here.</p>
        <small>Selected: {activePage}</small>
      </>
    )
  }

  return (
    <main className="app-shell">
      <nav className="navigation" aria-label="Pages">
        <strong>Pages</strong>
        {pages.map((page) => (
          <button
            key={page}
            className={activePage === page ? 'active' : ''}
            onClick={() => setActivePage(page)}
          >
            {page}
          </button>
        ))}
      </nav>
      <section className="content">{renderPage()}</section>
    </main>
  )
}
