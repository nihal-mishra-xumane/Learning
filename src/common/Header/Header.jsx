import { Search } from 'lucide-react'
import './Header.css'

function HeaderAction({ action, onAction }) {
  const Icon = action.icon
  return (
    <button
      className="app-header-action"
      type="button"
      aria-label={action.label}
      title={action.label}
      onClick={() => onAction?.(action)}
    >
      {Icon && <Icon size={18} aria-hidden="true" />}
      {action.badge !== undefined && <span className="app-header-badge">{action.badge > 99 ? '99+' : action.badge}</span>}
    </button>
  )
}

export default function Header({
  logo,
  navigationItems = [],
  activePath,
  onNavigate,
  searchConfig = {},
  actions = [],
  onAction,
  user,
}) {
  const LogoIcon = logo?.icon

  return (
    <header className="app-header">
      <a className="app-header-logo" href={logo?.href || '#'} onClick={(event) => {
        if (!logo?.href) event.preventDefault()
      }}>
        {logo?.src ? <img src={logo.src} alt={logo.alt || logo.label} /> : LogoIcon ? <LogoIcon size={22} aria-hidden="true" /> : <span className="app-header-logo-mark" aria-hidden="true">{logo?.mark || logo?.label?.slice(0, 1) || 'P'}</span>}
        <span>{logo?.label}</span>
      </a>

      <nav className="app-header-navigation" aria-label="Primary navigation">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const active = activePath === item.path || item.children?.some((child) => child.path === activePath)
          return (
            <button key={item.id} className={active ? 'is-active' : ''} type="button" onClick={() => item.path && onNavigate?.(item.path)}>
              {Icon && <Icon size={16} aria-hidden="true" />}
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      <form className="app-header-search" role="search" onSubmit={(event) => {
        event.preventDefault()
        searchConfig.onSearch?.(searchConfig.value || '')
      }}>
        <Search size={17} aria-hidden="true" />
        <input
          type="search"
          value={searchConfig.value || ''}
          placeholder={searchConfig.placeholder || 'Search'}
          aria-label={searchConfig.placeholder || 'Search'}
          onChange={(event) => searchConfig.onChange?.(event.target.value)}
        />
        {searchConfig.loading && <span className="app-header-search-status">...</span>}
      </form>

      <div className="app-header-actions">
        {actions.map((action) => <HeaderAction key={action.id} action={action} onAction={onAction} />)}
        {user && <button className="app-header-user" type="button" aria-label={`Open menu for ${user.name}`} onClick={() => onAction?.({ id: 'user-menu', user })}>
          <span className="app-header-avatar">{user.avatar || user.initials || user.name?.slice(0, 1)}</span>
          <span className="app-header-user-name">{user.name}</span>
        </button>}
      </div>
    </header>
  )
}
