import { useEffect, useMemo, useState } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight, MoreHorizontal, X } from 'lucide-react'
import './Sidebar.css'

function canView(item, role, permissions) {
  const roleAllowed = !item.roles || item.roles.includes(role)
  const permissionsAllowed = !item.permissions || item.permissions.every((permission) => permissions.includes(permission))
  return roleAllowed && permissionsAllowed
}

function hasVisibleItems(item, role, permissions) {
  return canView(item, role, permissions) || item.children?.some((child) => hasVisibleItems(child, role, permissions))
}

function filterItems(items, role, permissions) {
  return items
    .filter((item) => hasVisibleItems(item, role, permissions))
    .map((item) => ({
      ...item,
      children: item.children ? filterItems(item.children, role, permissions) : undefined,
    }))
}

export default function Sidebar({
  items = [],
  activePath,
  onNavigate,
  title = 'Workspace',
  brand = 'Brand',
  role = 'user',
  permissions = [],
  collapsed = false,
  onCollapsedChange,
  mobileOpen = false,
  onMobileClose,
  user,
  footerItems = [],
  onFooterNavigate,
  theme = 'dark',
  showBrand = true,
}) {
  const visibleItems = useMemo(() => filterItems(items, role, permissions), [items, role, permissions])
  const [expanded, setExpanded] = useState(() => new Set())

  useEffect(() => {
    const parentsOfActiveItem = new Set()

    const findParents = (menuItems, parents = []) => {
      menuItems.forEach((item) => {
        if (item.path === activePath) parents.forEach((parent) => parentsOfActiveItem.add(parent))
        if (item.children) findParents(item.children, [...parents, item.id])
      })
    }

    findParents(visibleItems)
    setExpanded((current) => new Set([...current, ...parentsOfActiveItem]))
  }, [activePath, visibleItems])

  const toggleExpanded = (id) => {
    setExpanded((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectItem = (item) => {
    if (item.children?.length) {
      toggleExpanded(item.id)
      return
    }
    if (item.path) onNavigate?.(item.path)
    onMobileClose?.()
  }

  const hasActiveChild = (item) => item.children?.some((child) => child.path === activePath || hasActiveChild(child))

  const renderItems = (menuItems, level = 0) => menuItems.map((item) => {
    const Icon = item.icon
    const hasChildren = item.children?.length > 0
    const isExpanded = expanded.has(item.id)
    const isActive = activePath === item.path
    const containsActive = hasActiveChild(item)

    return (
      <li key={item.id}>
        <button
          className={`sidebar-item ${isActive ? 'is-active' : ''} ${containsActive ? 'has-active-child' : ''}`}
          style={{ '--sidebar-level': level }}
          type="button"
          aria-current={isActive ? 'page' : undefined}
          aria-expanded={hasChildren ? isExpanded : undefined}
          onClick={() => selectItem(item)}
          title={collapsed ? item.label : undefined}
          aria-label={collapsed ? item.label : undefined}
        >
          {Icon && <Icon aria-hidden="true" size={18} strokeWidth={1.8} />}
          <span className="sidebar-label">{item.label}</span>
          <SidebarBadge value={item.badge} label={`${item.label} notifications`} />
          {hasChildren && !collapsed && (
            <ChevronDown className={isExpanded ? 'sidebar-chevron is-expanded' : 'sidebar-chevron'} aria-hidden="true" size={16} />
          )}
        </button>
        {hasChildren && isExpanded && !collapsed && (
          <ul className="sidebar-submenu">{renderItems(item.children, level + 1)}</ul>
        )}
      </li>
    )
  })

  return (
    <>
      {mobileOpen && <button className="sidebar-backdrop" type="button" aria-label="Close navigation" onClick={onMobileClose} />}
      <aside className={`sidebar ${collapsed ? 'is-collapsed' : ''} ${mobileOpen ? 'is-mobile-open' : ''}`} data-theme={theme} aria-label="Main navigation">
        <div className="sidebar-header">
          {showBrand && <div className="sidebar-brand">
            <span className="sidebar-mark">{brand ? brand.trim().charAt(0).toUpperCase() : 'B'}</span>
            <span className="sidebar-brand-name">{brand}</span>
          </div>}
          <button className="sidebar-close" type="button" aria-label="Close navigation" onClick={onMobileClose}>
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="sidebar-heading">
          <span>{title}</span>
          <span className="sidebar-role">{role}</span>
        </div>
        <nav className="sidebar-navigation">
          <ul className="sidebar-menu">{renderItems(visibleItems)}</ul>
        </nav>

        <div className="sidebar-footer">
          {footerItems.length > 0 && (
            <ul className="sidebar-footer-menu">
              {footerItems.map((item) => {
                const Icon = item.icon
                const isActive = activePath === item.path
                return (
                  <li key={item.id}>
                    <button
                      className={`sidebar-item sidebar-footer-item ${isActive ? 'is-active' : ''}`}
                      type="button"
                      onClick={() => item.path ? onNavigate?.(item.path) : onFooterNavigate?.(item)}
                      title={collapsed ? item.label : undefined}
                      aria-label={collapsed ? item.label : undefined}
                    >
                      {Icon && <Icon aria-hidden="true" size={18} strokeWidth={1.8} />}
                      <span className="sidebar-label">{item.label}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
          {user && (
            <div className="sidebar-user">
              <div className="sidebar-avatar" aria-hidden="true">{user.avatar || user.initials || user.name?.slice(0, 1)}</div>
              <div className="sidebar-user-copy">
                <strong>{user.name}</strong>
                <span>{user.role}</span>
              </div>
              <button className="sidebar-user-menu" type="button" aria-label={`More options for ${user.name}`} onClick={() => onFooterNavigate?.({ id: 'user-menu', ...user })}>
                <MoreHorizontal size={18} aria-hidden="true" />
              </button>
            </div>
          )}
        </div>

        <button className="sidebar-collapse" type="button" aria-label={collapsed ? 'Expand sidebar' : 'Minimize sidebar'} title={collapsed ? 'Expand sidebar' : 'Minimize sidebar'} onClick={() => onCollapsedChange?.(!collapsed)}>
          {collapsed ? <ChevronRight size={17} aria-hidden="true" /> : <ChevronLeft size={17} aria-hidden="true" />}
        </button>
      </aside>
    </>
  )
}

function SidebarBadge({ value, label }) {
  if (value === undefined || value === null) return null
  const displayValue = value > 99 ? '99+' : value
  return <span className="sidebar-badge" aria-label={`${value} ${label}`}>{displayValue}</span>
}