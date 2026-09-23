import { useEffect, useState } from 'react'
import { BarChart3, Bell, Boxes, CircleHelp, FileBarChart, FileText, FolderKanban, FolderOpen, Globe2, Home, Layers3, Link2, LogOut, Moon, Settings, ShieldCheck, Sun, Users, Workflow } from 'lucide-react'
import Sidebar from '../../common/Sidebar/Sidebar'
import './SidebarPage.css'

const notificationCategories = [
  { id: 'mentions', label: 'Mentions', path: '/notifications/mentions', icon: Bell, count: 4 },
  { id: 'approvals', label: 'Approvals', path: '/notifications/approvals', icon: ShieldCheck, count: 3 },
  { id: 'system-updates', label: 'System updates', path: '/notifications/system', icon: Settings, count: 2 },
  { id: 'other-notifications', label: 'Other', path: '/notifications/other', icon: CircleHelp, count: 3 },
]

const notificationTotal = notificationCategories.reduce((total, category) => total + category.count, 0)

const menuItems = [
  { id: 'overview', label: 'Overview', path: '/overview', icon: Home },
  {
    id: 'notifications', label: 'Notifications', icon: Bell, badge: notificationTotal, children: notificationCategories.map((category) => ({
      ...category,
      badge: category.count,
    })),
  },
  {
    id: 'workspace', label: 'Workspace', icon: Boxes, children: [
      {
        id: 'projects', label: 'Projects', icon: FolderKanban, children: [
          { id: 'active-projects', label: 'Active projects', path: '/projects/active', icon: FileText },
          { id: 'project-templates', label: 'Templates', path: '/projects/templates', icon: FolderOpen },
        ],
      },
      {
        id: 'team', label: 'Team', icon: Users, permissions: ['team:read'], children: [
          { id: 'members', label: 'Members', path: '/team/members', icon: Users, permissions: ['team:read'] },
          { id: 'roles', label: 'Roles & access', path: '/team/roles', icon: ShieldCheck, roles: ['admin'] },
        ],
      },
      {
        id: 'workflows', label: 'Workflows', icon: Workflow, children: [
          { id: 'automation', label: 'Automation', path: '/workflows/automation', icon: Layers3 },
          { id: 'approvals', label: 'Approvals', path: '/workflows/approvals', icon: ShieldCheck },
        ],
      },
    ],
  },
  {
    id: 'reports', label: 'Reports', icon: FileBarChart, children: [
      { id: 'performance', label: 'Performance', path: '/reports/performance', icon: BarChart3 },
      {
        id: 'exports', label: 'Exports', icon: FolderOpen, children: [
          { id: 'scheduled-exports', label: 'Scheduled', path: '/reports/exports/scheduled', icon: FileText },
          { id: 'export-history', label: 'History', path: '/reports/exports/history', icon: FileText },
        ],
      },
    ],
  },
  {
    id: 'content', label: 'Content', icon: FolderOpen, children: [
      { id: 'library', label: 'Asset library', path: '/content/library', icon: FolderKanban },
      { id: 'localization', label: 'Localization', path: '/content/localization', icon: Globe2 },
    ],
  },
  {
    id: 'integrations', label: 'Integrations', icon: Link2, children: [
      { id: 'connected-apps', label: 'Connected apps', path: '/integrations/apps', icon: Boxes },
      { id: 'webhooks', label: 'Webhooks', path: '/integrations/webhooks', icon: Workflow },
    ],
  },
  { id: 'analytics', label: 'Analytics', path: '/analytics', icon: BarChart3, roles: ['admin', 'manager'] },
  { id: 'alerts', label: 'Alerts', path: '/alerts', icon: Bell },
  { id: 'settings', label: 'Settings', path: '/settings', icon: Settings, roles: ['admin'] },
  { id: 'help', label: 'Help center', path: '/help', icon: CircleHelp },
]

export default function SidebarPage() {
  const [activePath, setActivePath] = useState('/overview')
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    const syncRoute = () => setActivePath(window.location.pathname)
    window.addEventListener('popstate', syncRoute)
    return () => window.removeEventListener('popstate', syncRoute)
  }, [])

  const navigate = (path) => {
    window.history.pushState({}, '', path)
    setActivePath(path)
  }

  const findActiveLabel = (items) => {
    for (const item of items) {
      if (item.path === activePath) return item.label
      if (item.children) {
        const childLabel = findActiveLabel(item.children)
        if (childLabel) return childLabel
      }
    }
    return null
  }

  const activeLabel = findActiveLabel(menuItems) || 'Overview'
  const footerItems = [
    { id: 'preferences', label: 'Preferences', icon: Settings, path: '/settings' },
    { id: 'theme', label: theme === 'dark' ? 'Light theme' : 'Dark theme', icon: theme === 'dark' ? Sun : Moon },
    { id: 'sign-out', label: 'Sign out', icon: LogOut },
  ]
  const user = { name: 'Workspace member', role: 'Manager', initials: 'WM' }

  return (
    <div className="page-heading">
      <p className="eyebrow">Common / Sidebar</p>
      <h1>Sidebar</h1>
      <p>A responsive navigation system with nested sections, active routes, and permission-aware menu visibility.</p>

      <div className="sidebar-preview">
        <Sidebar
          items={menuItems}
          activePath={activePath}
          onNavigate={navigate}
          onCollapsedChange={setCollapsed}
          collapsed={collapsed}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
          role="manager"
          permissions={['team:read']}
          theme={theme}
          user={user}
          footerItems={footerItems}
          onFooterNavigate={(item) => {
            if (item.id === 'theme') setTheme((current) => current === 'dark' ? 'light' : 'dark')
          }}
        />
        <main className="sidebar-preview__content">
          <button className="mobile-menu-button" type="button" onClick={() => setMobileOpen(true)}>Menu</button>
          <p className="sidebar-preview__eyebrow">Route: {activePath}</p>
          <h2>{activeLabel}</h2>
          <div className="sidebar-preview__status"><span /> Navigation is ready</div>
        </main>
      </div>
    </div>
  )
}