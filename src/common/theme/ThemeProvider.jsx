import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { defaultSettings, defaultThemeConfig, normalizeSettings, resolveTheme } from './tokens'
import { DEFAULT_PREFIX, applyCssVariables, toCssVariables } from './cssVariables'

/**
 * Makes the theme universal: mount this once at the root of Procurement or CRM
 * and every component below reads the same tokens.
 *
 *   <ThemeProvider config={createTheme({ ... })}>
 *     <App />
 *   </ThemeProvider>
 *
 * It holds two copies of the user's settings:
 *   draft - what is on screen right now, so the Theme Config page previews
 *           live across the whole app
 *   saved - what was last committed and persisted
 *
 * `saveSettings()` promotes draft to saved, `cancelChanges()` throws the draft
 * away, `resetSettings()` goes back to the shipped defaults.
 */

const MODES = ['light', 'dark', 'system']
const NO_TRANSITION_CLASS = 'ui-theme-switching'

const ThemeContext = createContext(null)

const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined'

/** localStorage throws in private mode / blocked-cookie setups - never let that break the app. */
function readStoredSettings(key) {
  if (!isBrowser) return null
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? normalizeSettings(JSON.parse(raw)) : null
  } catch {
    return null
  }
}

function writeStoredSettings(key, settings) {
  if (!isBrowser) return
  try {
    window.localStorage.setItem(key, JSON.stringify(settings))
  } catch {
    /* preference simply will not persist; the UI still works */
  }
}

function getSystemMode() {
  if (!isBrowser || typeof window.matchMedia !== 'function') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const sameSettings = (a, b) => JSON.stringify(a) === JSON.stringify(b)

export function ThemeProvider({
  children,
  config = defaultThemeConfig,
  initialSettings,
  onSave,
  storageKey = 'ui-theme',
  prefix = DEFAULT_PREFIX,
  persist = true,
  disableTransitionOnChange = true,
}) {
  // Product defaults, then anything the host app supplies, then what the user
  // saved last time.
  const baseSettings = useMemo(() => normalizeSettings(initialSettings), [initialSettings])

  const [savedSettings, setSavedSettings] = useState(
    () => (persist && readStoredSettings(storageKey)) || baseSettings,
  )
  const [draftSettings, setDraftSettings] = useState(savedSettings)
  const [systemMode, setSystemMode] = useState(getSystemMode)

  const resolvedMode = draftSettings.mode === 'system' ? systemMode : draftSettings.mode

  // Follow the OS setting while the user is on "system".
  useEffect(() => {
    if (!isBrowser || typeof window.matchMedia !== 'function') return undefined
    const query = window.matchMedia('(prefers-color-scheme: dark)')
    const handle = (event) => setSystemMode(event.matches ? 'dark' : 'light')

    // addListener is the Safari < 14 / older Edge fallback.
    if (query.addEventListener) query.addEventListener('change', handle)
    else query.addListener(handle)

    return () => {
      if (query.removeEventListener) query.removeEventListener('change', handle)
      else query.removeListener(handle)
    }
  }, [])

  const theme = useMemo(
    () => resolveTheme(config, { mode: resolvedMode, settings: draftSettings }),
    [config, resolvedMode, draftSettings],
  )

  const appliedKeys = useRef([])

  // Paint the tokens before the browser does, so there is no flash of the
  // previous theme when switching.
  useLayoutEffect(() => {
    if (!isBrowser) return undefined
    const root = document.documentElement

    let timer
    if (disableTransitionOnChange) {
      root.classList.add(NO_TRANSITION_CLASS)
      timer = window.setTimeout(() => root.classList.remove(NO_TRANSITION_CLASS), 0)
    }

    appliedKeys.current = applyCssVariables(root, toCssVariables(theme, prefix), appliedKeys.current)

    // Data attributes carry the choices CSS has to branch on - a custom
    // property cannot switch a rule on or off by itself.
    root.dataset.theme = theme.mode
    root.dataset.density = theme.density
    root.dataset.buttonStyle = theme.settings.buttonStyle
    root.dataset.sidebar = theme.settings.sidebarPosition
    // Tells the browser to theme scrollbars, form controls and caret to match.
    root.style.colorScheme = theme.mode

    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', theme.color.bg.canvas)

    return () => window.clearTimeout(timer)
  }, [theme, prefix, disableTransitionOnChange])

  /** Patch one or more settings. This is what every control on the config page calls. */
  const updateSettings = useCallback((patch) => {
    setDraftSettings((current) =>
      normalizeSettings({ ...current, ...(typeof patch === 'function' ? patch(current) : patch) }),
    )
  }, [])

  const saveSettings = useCallback(() => {
    // Read the draft from the closure rather than from inside a state updater:
    // updaters must stay pure, and StrictMode runs them twice.
    setSavedSettings(draftSettings)
    if (persist) writeStoredSettings(storageKey, draftSettings)
    onSave?.(draftSettings)
    return draftSettings
  }, [draftSettings, onSave, persist, storageKey])

  /** Discard edits and go back to the last saved state. */
  const cancelChanges = useCallback(() => setDraftSettings(savedSettings), [savedSettings])

  /** Back to the shipped defaults. Still needs a save to be persisted. */
  const resetSettings = useCallback(() => setDraftSettings(baseSettings), [baseSettings])

  const exportSettings = useCallback(
    () => JSON.stringify({ version: 1, name: config.name, settings: draftSettings }, null, 2),
    [config.name, draftSettings],
  )

  /**
   * Import a theme file. Returns a result object rather than throwing, so the
   * caller can show a validation message instead of losing the screen.
   */
  const importSettings = useCallback((json) => {
    try {
      const parsed = typeof json === 'string' ? JSON.parse(json) : json
      const incoming = parsed?.settings ?? parsed
      if (!incoming || typeof incoming !== 'object') {
        return { ok: false, error: 'That file does not contain any theme settings.' }
      }
      setDraftSettings(normalizeSettings(incoming))
      return { ok: true }
    } catch {
      return { ok: false, error: 'That file is not valid JSON.' }
    }
  }, [])

  // Convenience wrappers so simple consumers never touch the settings object.
  const setMode = useCallback(
    (next) => updateSettings({ mode: MODES.includes(next) ? next : 'system' }),
    [updateSettings],
  )
  const toggleMode = useCallback(
    () => setMode(resolvedMode === 'dark' ? 'light' : 'dark'),
    [resolvedMode, setMode],
  )
  const setDensity = useCallback((next) => updateSettings({ density: next }), [updateSettings])

  const value = useMemo(
    () => ({
      theme,
      config,
      settings: draftSettings,
      savedSettings,
      isDirty: !sameSettings(draftSettings, savedSettings),
      isDefault: sameSettings(draftSettings, baseSettings),
      updateSettings,
      saveSettings,
      cancelChanges,
      resetSettings,
      exportSettings,
      importSettings,
      mode: draftSettings.mode,
      resolvedMode,
      isDark: resolvedMode === 'dark',
      density: theme.density,
      setMode,
      toggleMode,
      setDensity,
      modes: MODES,
    }),
    [
      theme,
      config,
      draftSettings,
      savedSettings,
      baseSettings,
      resolvedMode,
      updateSettings,
      saveSettings,
      cancelChanges,
      resetSettings,
      exportSettings,
      importSettings,
      setMode,
      toggleMode,
      setDensity,
    ],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

// Used only when a component renders outside a provider - see useTheme below.
const fallbackTheme = resolveTheme(defaultThemeConfig, { mode: 'light', settings: defaultSettings })
let warnedAboutMissingProvider = false
const noop = () => {}

/**
 * Read the active theme.
 *
 * Outside a provider this warns and falls back to the light theme rather than
 * throwing: a missing provider should not blank out the whole screen.
 */
export function useTheme() {
  const context = useContext(ThemeContext)

  if (!context) {
    if (!warnedAboutMissingProvider && import.meta.env?.DEV) {
      warnedAboutMissingProvider = true
      console.warn('[theme] useTheme() was called outside <ThemeProvider>. Falling back to the light theme.')
    }
    return {
      theme: fallbackTheme,
      config: defaultThemeConfig,
      settings: defaultSettings,
      savedSettings: defaultSettings,
      isDirty: false,
      isDefault: true,
      updateSettings: noop,
      saveSettings: noop,
      cancelChanges: noop,
      resetSettings: noop,
      exportSettings: () => '',
      importSettings: () => ({ ok: false, error: 'No theme provider is mounted.' }),
      mode: 'light',
      resolvedMode: 'light',
      isDark: false,
      density: 'comfortable',
      setMode: noop,
      toggleMode: noop,
      setDensity: noop,
      modes: MODES,
    }
  }

  return context
}

export { ThemeContext, MODES as THEME_MODES }
