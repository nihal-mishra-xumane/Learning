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
      <section className="content">
        <p>Page content will be displayed here.</p>
        <small>Selected: {activePage}</small>
      </section>
    </main>
  )
}
