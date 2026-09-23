/**
 * Bridge between the JS token object and CSS.
 *
 * Tokens are applied once, on the document root, as custom properties. Styling
 * then happens in plain CSS (`var(--ui-color-bg-surface)`), which means:
 *   - no inline styles on every component, so no re-render storm on theme change
 *   - the browser repaints a theme switch by itself
 *   - third-party CSS and dev tools can read the same values
 */

export const DEFAULT_PREFIX = '--ui'

// Structural metadata and raw settings, not styling values.
const SKIP_KEYS = new Set(['breakpoint', 'name', 'settings', 'mode', 'density'])

const toKebab = (key) =>
  String(key)
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()

/**
 * Flatten a nested token object into CSS custom properties.
 * `{ color: { bg: { canvas: '#fff' } } }` -> `{ '--ui-color-bg-canvas': '#fff' }`
 */
export function toCssVariables(theme, prefix = DEFAULT_PREFIX) {
  const vars = {}

  const walk = (node, path) => {
    for (const [key, value] of Object.entries(node)) {
      if (path.length === 0 && SKIP_KEYS.has(key)) continue
      const next = [...path, toKebab(key)]

      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        walk(value, next)
      } else if (value !== undefined) {
        vars[`${prefix}-${next.join('-')}`] = String(value)
      }
    }
  }

  walk(theme, [])
  return vars
}

/**
 * Write the variables onto an element (normally `document.documentElement`).
 * Returns the applied keys so the caller can clean up ones that disappear when
 * a consumer swaps in a theme config with fewer tokens.
 */
export function applyCssVariables(element, vars, previousKeys = []) {
  if (!element?.style) return []

  for (const key of previousKeys) {
    if (!(key in vars)) element.style.removeProperty(key)
  }
  for (const [key, value] of Object.entries(vars)) {
    element.style.setProperty(key, value)
  }

  return Object.keys(vars)
}

/** Serialise the token set as a CSS rule - handy for SSR or a static export. */
export function toCssText(theme, { prefix = DEFAULT_PREFIX, selector = ':root' } = {}) {
  const vars = toCssVariables(theme, prefix)
  const body = Object.entries(vars)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n')
  return `${selector} {\n${body}\n}`
}
