import { Monitor, Moon, Sun } from 'lucide-react'
import SegmentedControl from '../components/SegmentedControl'
import { useTheme } from './ThemeProvider'

const MODE_OPTIONS = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'system', label: 'System', icon: Monitor },
  { value: 'dark', label: 'Dark', icon: Moon },
]

/**
 * Drop-in theme switcher for any app header.
 *
 * Uncontrolled by default (it reads and writes the provider). Pass `value` +
 * `onChange` if the host app stores the preference itself, e.g. on a user
 * profile fetched from the API.
 *
 *   <ThemeToggle />
 *   <ThemeToggle value={user.theme} onChange={saveThemePreference} />
 */
export default function ThemeToggle({
  value,
  onChange,
  showSystem = true,
  iconOnly = false,
  label = 'Colour theme',
  className = '',
}) {
  const { mode, setMode } = useTheme()

  const current = value ?? mode
  const options = showSystem
    ? MODE_OPTIONS
    : MODE_OPTIONS.filter((option) => option.value !== 'system')

  const handleChange = (next) => {
    // Always update the provider so the whole app follows, then let the parent
    // persist it wherever it wants.
    setMode(next)
    onChange?.(next)
  }

  return (
    <SegmentedControl
      label={label}
      options={options}
      value={current}
      onChange={handleChange}
      iconOnly={iconOnly}
      className={className}
    />
  )
}
