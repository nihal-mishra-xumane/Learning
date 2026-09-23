import { useId, useMemo, useRef, useState } from 'react'
import {
  AlertTriangle,
  Check,
  Download,
  Monitor,
  Moon,
  RotateCcw,
  Sun,
  Upload,
} from 'lucide-react'
import {
  Button,
  ColorPicker,
  RadioCardGroup,
  SegmentedControl,
  Select,
  Slider,
} from '../../common/components'
import {
  SETTING_LIMITS,
  colorPresets,
  contrastRatio,
  fontStacks,
  palette,
  useTheme,
} from '../../common/theme'
import ThemePreview from './ThemePreview'
import './ThemeConfigPage.css'

/**
 * Theme Configuration screen.
 *
 * Every control writes straight into the provider's draft settings, so the
 * whole app - sidebar, header and the preview panel - updates as you change
 * things. Nothing is persisted until Save.
 *
 * The page owns no business logic: pass `onSave` to send the settings to your
 * API, and `onSaved` / `onCancel` to react. Without them it just saves locally.
 */

const BUTTON_STYLE_OPTIONS = [
  { value: 'filled', label: 'Filled' },
  { value: 'outlined', label: 'Outlined' },
]

/** Miniature window used on the theme-mode cards. */
function ModeThumb({ shell, surface, accent, split = false }) {
  return (
    <span className="mode-thumb" style={{ background: shell }}>
      <span className="mode-thumb-side" style={{ background: surface }} />
      <span className="mode-thumb-main">
        <span className="mode-thumb-bar" style={{ background: accent }} />
        <span className="mode-thumb-bar" style={{ background: surface }} />
        <span className="mode-thumb-bar" style={{ background: surface, width: '60%' }} />
      </span>
      {split ? (
        <span
          className="mode-thumb-split"
          style={{ background: palette.neutral[900], borderColor: palette.neutral[700] }}
        />
      ) : null}
    </span>
  )
}

function Section({ title, description, children }) {
  return (
    <section className="ui-card">
      <header className="ui-card-header">
        <div>
          <h2 className="ui-title-sm">{title}</h2>
          {description ? <p className="ui-text-muted">{description}</p> : null}
        </div>
      </header>
      <div className="ui-card-body">{children}</div>
    </section>
  )
}

/** One label + description + control row. Owns the id wiring for the control. */
function SettingRow({ title, description, children }) {
  const id = useId()
  const labelId = `${id}-label`

  return (
    <div className="ui-setting">
      <div className="ui-setting-text">
        <p className="ui-setting-title" id={labelId}>
          {title}
        </p>
        {description ? <p className="ui-text-muted">{description}</p> : null}
      </div>
      <div className="ui-setting-control">
        {typeof children === 'function' ? children({ labelId, id }) : children}
      </div>
    </div>
  )
}

export default function ThemeConfigPage({ onSave, onSaved, onCancel }) {
  const {
    theme,
    settings,
    updateSettings,
    saveSettings,
    cancelChanges,
    resetSettings,
    exportSettings,
    importSettings,
    isDirty,
    isDefault,
  } = useTheme()

  const [status, setStatus] = useState('idle') // idle | saving | success | error
  const [feedback, setFeedback] = useState(null)
  const fileInputRef = useRef(null)

  const set = (patch) => {
    updateSettings(patch)
    // Any edit invalidates the previous save result.
    if (status !== 'idle') setStatus('idle')
  }

  // Contrast is checked against what will actually be rendered, so a bad colour
  // choice is caught here rather than in an audit three months later.
  const warnings = useMemo(() => {
    const list = []
    const buttonRatio = contrastRatio(theme.color.button.text, theme.color.primary.solid)
    if (buttonRatio < 4.5) {
      list.push(
        `Button label contrast is ${buttonRatio.toFixed(2)}:1 - below the 4.5:1 minimum. Clear the text colour to let the theme compute it.`,
      )
    }
    const bodyRatio = contrastRatio(theme.color.text.primary, theme.color.bg.surface)
    if (bodyRatio < 4.5) {
      list.push(`Body text contrast is ${bodyRatio.toFixed(2)}:1 on your surface colour.`)
    }
    return list
  }, [theme])

  const handleSave = async () => {
    setStatus('saving')
    setFeedback(null)
    try {
      // The API call, if there is one, belongs to the parent screen.
      await onSave?.(settings)
      saveSettings()
      setStatus('success')
      setFeedback('Theme saved.')
      onSaved?.(settings)
    } catch (error) {
      setStatus('error')
      setFeedback(error?.message || 'Could not save the theme. Your changes are still here.')
    }
  }

  const handleExport = () => {
    try {
      const blob = new Blob([exportSettings()], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'theme.json'
      link.click()
      URL.revokeObjectURL(url)
    } catch {
      setStatus('error')
      setFeedback('Could not export the theme file.')
    }
  }

  const handleImport = (event) => {
    const file = event.target.files?.[0]
    // Reset the input so choosing the same file twice still fires a change.
    event.target.value = ''
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const result = importSettings(String(reader.result))
      setStatus(result.ok ? 'idle' : 'error')
      setFeedback(result.ok ? 'Theme imported. Review it, then save.' : result.error)
    }
    reader.onerror = () => {
      setStatus('error')
      setFeedback('Could not read that file.')
    }
    reader.readAsText(file)
  }

  return (
    <div className="theme-config">
      <header className="theme-config-header">
        <div>
          <h1 className="ui-title-lg">Theme configuration</h1>
          <p className="ui-text-secondary">
            Changes preview across the whole app immediately. Nothing is saved until you choose to.
          </p>
        </div>

        <div className="theme-config-actions">
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            className="ui-sr-only"
            onChange={handleImport}
          />
          <Button variant="ghost" startIcon={Upload} onClick={() => fileInputRef.current?.click()}>
            Import
          </Button>
          <Button variant="ghost" startIcon={Download} onClick={handleExport}>
            Export
          </Button>
          <Button variant="secondary" startIcon={RotateCcw} disabled={isDefault} onClick={resetSettings}>
            Reset to default
          </Button>
          <Button
            variant="secondary"
            disabled={!isDirty}
            onClick={() => {
              cancelChanges()
              setStatus('idle')
              setFeedback(null)
              onCancel?.()
            }}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            startIcon={status === 'success' && !isDirty ? Check : undefined}
            loading={status === 'saving'}
            disabled={!isDirty}
            onClick={handleSave}
          >
            {status === 'success' && !isDirty ? 'Saved' : 'Save changes'}
          </Button>
        </div>
      </header>

      {feedback ? (
        <div
          className={`ui-alert ${status === 'error' ? 'ui-alert-danger' : 'ui-alert-success'}`}
          role={status === 'error' ? 'alert' : 'status'}
        >
          {status === 'error' ? <AlertTriangle size={16} aria-hidden="true" /> : <Check size={16} aria-hidden="true" />}
          <span>{feedback}</span>
        </div>
      ) : null}

      {warnings.length > 0 ? (
        <div className="ui-alert ui-alert-warning" role="alert">
          <AlertTriangle size={16} aria-hidden="true" />
          <span>
            {warnings.map((warning) => (
              <span key={warning} className="theme-config-warning">
                {warning}
              </span>
            ))}
          </span>
        </div>
      ) : null}

      <div className="theme-config-layout">
        <div className="theme-config-panel">
          <Section title="Theme mode" description="Select your default theme.">
            <RadioCardGroup
              label="Theme mode"
              value={settings.mode}
              onChange={(mode) => set({ mode })}
              options={[
                {
                  value: 'light',
                  label: 'Light',
                  icon: Sun,
                  preview: (
                    <ModeThumb
                      shell={palette.neutral[100]}
                      surface={palette.neutral[0]}
                      accent={settings.primaryColor}
                    />
                  ),
                },
                {
                  value: 'system',
                  label: 'System default',
                  icon: Monitor,
                  preview: (
                    <ModeThumb
                      shell={palette.neutral[100]}
                      surface={palette.neutral[0]}
                      accent={settings.primaryColor}
                      split
                    />
                  ),
                },
                {
                  value: 'dark',
                  label: 'Dark',
                  icon: Moon,
                  preview: (
                    <ModeThumb
                      shell={palette.neutral[950]}
                      surface={palette.neutral[800]}
                      accent={settings.primaryColor}
                    />
                  ),
                },
              ]}
            />
          </Section>

          <Section title="Colours" description="One value per role - the full ramp is generated from it.">
            <SettingRow
              title="Primary colour"
              description="Main actions, links and selected states."
            >
              {({ id }) => (
                <ColorPicker
                  id={id}
                  value={settings.primaryColor}
                  presets={colorPresets.primary}
                  onChange={(primaryColor) => set({ primaryColor })}
                />
              )}
            </SettingRow>

            <SettingRow title="Accent colour" description="Secondary and supporting actions.">
              {({ id }) => (
                <ColorPicker
                  id={id}
                  value={settings.accentColor}
                  presets={colorPresets.accent}
                  onChange={(accentColor) => set({ accentColor })}
                />
              )}
            </SettingRow>
          </Section>

          <Section title="Typography">
            <SettingRow title="Font family">
              {({ labelId, id }) => (
                <Select
                  id={id}
                  aria-labelledby={labelId}
                  value={settings.fontFamily}
                  onChange={(fontFamily) => set({ fontFamily })}
                  options={Object.entries(fontStacks).map(([value, font]) => ({
                    value,
                    label: font.label,
                  }))}
                />
              )}
            </SettingRow>

            <SettingRow
              title="Base font size"
              description="Scales the whole type ramp, not just body text."
            >
              {({ labelId }) => (
                <Slider
                  aria-labelledby={labelId}
                  value={settings.fontSize}
                  min={SETTING_LIMITS.fontSize.min}
                  max={SETTING_LIMITS.fontSize.max}
                  onChange={(fontSize) => set({ fontSize })}
                  formatValue={(raw) => `${raw}px`}
                />
              )}
            </SettingRow>
          </Section>

          <Section title="Buttons">
            <SettingRow title="Button style">
              {({ labelId }) => (
                <SegmentedControl
                  labelledBy={labelId}
                  fullWidth
                  options={BUTTON_STYLE_OPTIONS}
                  value={settings.buttonStyle}
                  onChange={(buttonStyle) => set({ buttonStyle })}
                />
              )}
            </SettingRow>
          </Section>

          <Section title="Background and surfaces">
            <SettingRow title="Background colour" description="The page canvas behind every panel.">
              {({ id }) => (
                <ColorPicker
                  id={id}
                  value={settings.backgroundColor}
                  resolvedValue={theme.color.bg.canvas}
                  allowAuto
                  onChange={(backgroundColor) => set({ backgroundColor })}
                />
              )}
            </SettingRow>

            <SettingRow title="Surface colour" description="Cards, panels and menus.">
              {({ id }) => (
                <ColorPicker
                  id={id}
                  value={settings.surfaceColor}
                  resolvedValue={theme.color.bg.surface}
                  allowAuto
                  onChange={(surfaceColor) => set({ surfaceColor })}
                />
              )}
            </SettingRow>
          </Section>
        </div>

        <aside className="theme-config-preview" aria-label="Live preview">
          <div className="theme-config-preview-inner">
            <div className="theme-config-preview-title">
              <h2 className="ui-title-sm">Live preview</h2>
              {isDirty ? <span className="ui-badge ui-badge-info">Unsaved</span> : null}
            </div>
            {/* No props: the preview ships neutral placeholder content. Pass
                brand / fields / rows here if a host app wants its own sample. */}
            <ThemePreview />
          </div>
        </aside>
      </div>
    </div>
  )
}
