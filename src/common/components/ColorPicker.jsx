import { useEffect, useId, useState } from 'react'
import { Check, RotateCcw } from 'lucide-react'
import { parseColor, rgbToHex } from '../theme/contrast'

/**
 * Colour control: a native picker, a typed hex/rgb value and optional presets.
 *
 * The three stay in sync but only valid input is pushed to the parent, so a
 * half-typed `#2b` never reaches the theme. Invalid text is reported inline
 * instead of being silently dropped.
 *
 * `allowAuto` adds a "derive it" option for colours that the theme can work out
 * on its own (surface, border, button text) - the parent gets `null`.
 */
export default function ColorPicker({
  value,
  onChange,
  presets = [],
  allowAuto = false,
  autoLabel = 'Auto',
  resolvedValue,
  disabled = false,
  id,
  describedBy,
  className = '',
}) {
  const generatedId = useId()
  const fieldId = id || generatedId
  const errorId = `${fieldId}-color-error`

  const [text, setText] = useState(value || '')
  const [error, setError] = useState(null)

  // Follow the value when it changes from outside (reset, import, preset).
  useEffect(() => {
    setText(value || '')
    setError(null)
  }, [value])

  // The native picker needs a concrete colour even when the setting is "auto".
  const swatchValue = normalizeHex(value) || normalizeHex(resolvedValue) || '#000000'

  const commit = (raw) => {
    const trimmed = raw.trim()

    if (!trimmed) {
      if (allowAuto) {
        setError(null)
        onChange?.(null)
        return
      }
      setError('Enter a colour.')
      return
    }

    const hex = normalizeHex(trimmed)
    if (!hex) {
      setError('Use a hex value like #2563EB, or rgb(37, 99, 235).')
      return
    }

    setError(null)
    onChange?.(hex)
  }

  return (
    <div className={`ui-color-picker ${className}`.trim()}>
      <div className="ui-color-row">
        <span className="ui-color-swatch" style={{ background: value || swatchValue }}>
          <input
            type="color"
            id={fieldId}
            className="ui-color-native"
            value={swatchValue}
            disabled={disabled}
            aria-label="Pick a colour"
            onChange={(event) => {
              setText(event.target.value)
              setError(null)
              onChange?.(event.target.value)
            }}
          />
        </span>

        <input
          type="text"
          className="ui-input ui-color-text"
          value={text}
          disabled={disabled}
          spellCheck={false}
          placeholder={allowAuto ? autoLabel : '#000000'}
          aria-invalid={Boolean(error)}
          aria-describedby={[error ? errorId : null, describedBy].filter(Boolean).join(' ') || undefined}
          onChange={(event) => setText(event.target.value)}
          onBlur={(event) => commit(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              commit(event.currentTarget.value)
            }
          }}
        />

        {allowAuto && value ? (
          <button
            type="button"
            className="ui-btn ui-btn-ghost ui-btn-sm ui-btn-icon"
            title={`Back to ${autoLabel.toLowerCase()}`}
            aria-label={`Back to ${autoLabel.toLowerCase()}`}
            disabled={disabled}
            onClick={() => onChange?.(null)}
          >
            <RotateCcw size={14} aria-hidden="true" />
          </button>
        ) : null}
      </div>

      {presets.length > 0 ? (
        <div className="ui-color-presets" role="group" aria-label="Preset colours">
          {presets.map((preset) => {
            const isActive = normalizeHex(value) === normalizeHex(preset)
            return (
              <button
                key={preset}
                type="button"
                className="ui-color-preset"
                style={{ background: preset }}
                aria-label={preset}
                aria-pressed={isActive}
                title={preset}
                disabled={disabled}
                onClick={() => onChange?.(preset)}
              >
                {isActive ? <Check size={14} aria-hidden="true" /> : null}
              </button>
            )
          })}
        </div>
      ) : null}

      {error ? (
        <p className="ui-error" id={errorId} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

/** Accept hex or rgb() and return a canonical `#rrggbb`, or null if unusable. */
function normalizeHex(input) {
  const parsed = parseColor(input)
  return parsed ? rgbToHex(parsed.r, parsed.g, parsed.b) : null
}
