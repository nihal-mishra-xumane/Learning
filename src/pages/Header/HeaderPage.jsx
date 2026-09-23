import { useState } from 'react'
import Header from '../../common/Header/header'

const user = {
  name: 'Madhurima Dutta',
  email: 'madhurima.dutta@example.com',
  role: 'Administrator',
  initials: 'MD',
}

const profileFields = [
  { key: 'name', label: 'Full name' },
  { key: 'email', label: 'Email address' },
  { key: 'role', label: 'Role' },
]

export default function HeaderPage() {
  const [notificationCount, setNotificationCount] = useState(5)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="header-page">
      <div className="page-heading">
        <p className="eyebrow">Common / Header</p>
        <h1>Header</h1>
        <p>Application header with brand, notifications, and profile menu — used at the top of every page.</p>
      </div>

      <section className="component-section" aria-labelledby="header-default-heading">
        <div className="section-heading">
          <h2 id="header-default-heading">Default</h2>
          <p>Standard header with notifications, profile menu, and logout.</p>
        </div>
        <Header
          appName="PlansStudio"
          appLogo="CA"
          user={user}
          profileFields={profileFields}
          notificationCount={notificationCount}
          onNotificationsClick={() => setNotificationCount(0)}
          onProfileClick={() => undefined}
          onLogout={() => undefined}
        />
      </section>

      <section className="component-section" aria-labelledby="header-mobile-heading">
        <div className="section-heading">
          <h2 id="header-mobile-heading">With mobile menu toggle</h2>
          <p>Shows the mobile menu button for responsive layouts with a collapsible sidebar.</p>
        </div>
        <Header
          appName="PlansStudio"
          user={user}
          profileFields={profileFields}
          notificationCount={notificationCount}
          showMobileMenuButton
          mobileMenuOpen={mobileMenuOpen}
          onMobileMenuToggle={setMobileMenuOpen}
        />
      </section>

      <section className="component-section" aria-labelledby="header-minimal-heading">
        <div className="section-heading">
          <h2 id="header-minimal-heading">Minimal</h2>
          <p>Notifications and logout hidden — only the profile action remains.</p>
        </div>
        <Header
          appName="PlansStudio"
          user={user}
          showNotifications={false}
          showLogout={false}
        />
      </section>

      <section className="component-section" aria-labelledby="header-loading-heading">
        <div className="section-heading">
          <h2 id="header-loading-heading">Loading / disabled</h2>
          <p>Interaction states used while the app is loading or the header is disabled.</p>
        </div>
        <Header appName="PlansStudio" user={user} isLoading />
        <Header appName="PlansStudio" user={user} disabled />
      </section>
    </div>
  )
}
