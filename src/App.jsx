import { useState } from 'react'

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
    <main className="app-shell">
      <nav className="navigation" aria-label="Common components">
        <strong>Common components</strong>
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
      <section className="content">
        <p>Common component page will be displayed here.</p>
        <small>Selected: {activePage}</small>
      </section>
    </main>
  )
}
