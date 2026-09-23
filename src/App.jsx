import { useMemo, useState } from 'react'
import Header from './common/Header/header'
import Buttons from './pages/Buttons/Buttons'
import FiltersPage from './pages/Filters/FiltersPage'
import Forms from './pages/Forms/Forms'
import ModalsPage from './pages/Modals/Modals'
import NotificationsPage from './pages/Notifications/Notifications'
import SearchPage from './pages/Search/SearchPage'
import SidebarPage from './pages/Sidebar/SidebarPage'
import StatusBadgesPage from './pages/StatusBadges/StatusBadgesPage'
import TabsPage from './pages/Tabs/Tabs'
import './styles.css'

const pageConfig = [
  { id: 'login', label: 'Login', description: 'Manage login and authentication screens.' },
  { id: 'header', label: 'Header', description: 'Reusable application header component.' },
  { id: 'sidebar', label: 'Sidebar', description: 'Reusable sidebar and navigation component.' },
  { id: 'theme', label: 'Theme', description: 'Application colors, typography, and themes.' },
  { id: 'buttons', label: 'Buttons', description: 'Reusable buttons and action controls.' },
  { id: 'tables', label: 'Tables', description: 'Reusable data table components.' },
  { id: 'forms', label: 'Forms', description: 'Reusable form fields and validation patterns.' },
  { id: 'filters', label: 'Filters', description: 'Reusable filter controls.' },
  { id: 'search', label: 'Search', description: 'Reusable search components.' },
  { id: 'tabs', label: 'Tabs', description: 'Reusable tab navigation components.' },
  { id: 'modals', label: 'Modals', description: 'Reusable dialog and modal components.' },
  { id: 'notifications', label: 'Notifications', description: 'Reusable alerts, toasts, and notification panels.' },
  { id: 'status-badges', label: 'Status badges', description: 'Reusable status and label components.' },
]

const user = {
  name: 'Madhurima Dutta',
  email: 'madhurima.dutta@example.com',
  role: 'Administrator',
}

const profileFields = [
  { key: 'name', label: 'Full name' },
  { key: 'email', label: 'Email address' },
  { key: 'role', label: 'Role' },
]

const initialNotifications = [
  { id: 1, title: 'New procurement request', isRead: false },
  { id: 2, title: 'Profile updated', isRead: false },
  { id: 3, title: 'New CRM task assigned', isRead: false },
]

function PagePreview({ activePage }) {
  if (activePage === 'buttons') return <Buttons />
  if (activePage === 'forms') return <Forms />
  if (activePage === 'filters') return <FiltersPage />
  if (activePage === 'search') return <SearchPage />
  if (activePage === 'sidebar') return <SidebarPage />
  if (activePage === 'tabs') return <TabsPage />
  if (activePage === 'modals') return <ModalsPage />
  if (activePage === 'notifications') return <NotificationsPage />
  if (activePage === 'status-badges') return <StatusBadgesPage />

  const page = pageConfig.find((item) => item.id === activePage) || pageConfig[0]
  return (
    <>
      <p>{page.description}</p>
      <small>Page content for <strong>{page.label}</strong> will be displayed here.</small>
    </>
  )
}

export default function App() {
  const [activePage, setActivePage] = useState('theme')
  const [notifications, setNotifications] = useState(initialNotifications)
  const selectedPage = useMemo(
    () => pageConfig.find((page) => page.id === activePage) || pageConfig[0],
    [activePage],
  )

  return (
    <div className="app-shell app-shell--light">
      <Header
        appName="Airtecture"
        appLogo="CA"
        user={user}
        profileFields={profileFields}
        notificationCount={notifications.filter((item) => !item.isRead).length}
        notifications={notifications}
        onNotificationsClick={() => setNotifications((items) => items.map((item) => ({ ...item, isRead: true })))}
        onProfileClick={() => undefined}
        onLogout={() => undefined}
        onLogoClick={() => setActivePage('theme')}
        showNotifications
        showProfile
        showUserName
        showLogout
        showProfileAction
      />

      <div className="app-body">
        <nav className="navigation" aria-label="Application pages">
          <div className="navigation__header">
            <strong>Pages</strong>
            <span className="navigation__count">{pageConfig.length}</span>
          </div>
          <div className="navigation-list">
            {pageConfig.map((page) => (
              <button
                key={page.id}
                type="button"
                className={activePage === page.id ? 'navigation__item navigation__item--active' : 'navigation__item'}
                onClick={() => setActivePage(page.id)}
                aria-current={activePage === page.id ? 'page' : undefined}
              >
                {page.label}
              </button>
            ))}
          </div>
        </nav>

        <main className="content">
          <div className="content__header">
            <div>
              <p className="content__eyebrow">Common components</p>
              <h1 className="content__title">{selectedPage.label}</h1>
              <p className="content__description">{selectedPage.description}</p>
            </div>
            <span className="content__status">Active</span>
          </div>
          <div className="content__card">
            <PagePreview activePage={activePage} />
          </div>
        </main>
      </div>
    </div>
  )
}
