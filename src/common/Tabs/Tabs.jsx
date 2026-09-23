import { useLayoutEffect, useRef, useState } from 'react'
import './Tabs.css'

export default function Tabs({ tabs = [], activeTab, onChange, variant = 'underline' }) {
  const listRef = useRef(null)
  const activeTabRef = useRef(null)
  const [indicatorStyle, setIndicatorStyle] = useState({})
  const selectedIndex = tabs.findIndex((tab) => tab.id === activeTab && !tab.disabled)
  const firstEnabledIndex = tabs.findIndex((tab) => !tab.disabled)

  useLayoutEffect(() => {
    const updateIndicator = () => {
      const selectedElement = activeTabRef.current
      const listElement = listRef.current

      if (!selectedElement || !listElement) {
        setIndicatorStyle({ opacity: 0 })
        return
      }

      setIndicatorStyle({
        opacity: 1,
        transform: `translateX(${selectedElement.offsetLeft}px)`,
        width: `${selectedElement.offsetWidth}px`,
      })
    }

    updateIndicator()
    window.addEventListener('resize', updateIndicator)

    return () => window.removeEventListener('resize', updateIndicator)
  }, [activeTab, tabs, variant])

  const selectTab = (tab) => {
    if (!tab.disabled) onChange?.(tab.id)
  }

  const handleKeyDown = (event, index) => {
    const enabledIndexes = tabs
      .map((tab, tabIndex) => (tab.disabled ? -1 : tabIndex))
      .filter((tabIndex) => tabIndex !== -1)

    if (!enabledIndexes.length) return

    const currentEnabledIndex = enabledIndexes.indexOf(index)
    let nextIndex = currentEnabledIndex

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextIndex = (currentEnabledIndex + 1) % enabledIndexes.length
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextIndex = (currentEnabledIndex - 1 + enabledIndexes.length) % enabledIndexes.length
    } else if (event.key === 'Home') {
      nextIndex = 0
    } else if (event.key === 'End') {
      nextIndex = enabledIndexes.length - 1
    } else {
      return
    }

    event.preventDefault()
    const tabList = event.currentTarget.parentElement
    tabList?.querySelectorAll('[role="tab"]')[enabledIndexes[nextIndex]]?.focus()
    selectTab(tabs[enabledIndexes[nextIndex]])
  }

  return (
    <div className={`tabs tabs--${variant}`}>
      <div ref={listRef} className="tabs__list" role="tablist" aria-label="Available tabs">
        {tabs.map((tab, index) => {
          const isActive = tab.id === activeTab && !tab.disabled
          const tabIndex = isActive || (selectedIndex === -1 && index === firstEnabledIndex) ? 0 : -1

          return (
            <button
              key={tab.id}
              ref={isActive ? activeTabRef : null}
              type="button"
              className={`tabs__tab${isActive ? ' tabs__tab--active' : ''}${
                tab.disabled ? ' tabs__tab--disabled' : ''
              }`}
              role="tab"
              aria-selected={isActive}
              aria-disabled={tab.disabled || undefined}
              tabIndex={tabIndex}
              disabled={tab.disabled}
              onClick={() => selectTab(tab)}
              onKeyDown={(event) => handleKeyDown(event, index)}
            >
              {tab.icon && <span className="tabs__icon" aria-hidden="true">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count !== null && (
                <span className="tabs__count">{tab.count}</span>
              )}
            </button>
          )
        })}
        <span className="tabs__indicator" aria-hidden="true" style={indicatorStyle} />
      </div>
    </div>
  )
}
