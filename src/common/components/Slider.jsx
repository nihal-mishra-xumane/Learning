import { forwardRef } from 'react'

/**
 * Range control with a readable value.
 *
 * Built on `<input type="range">` so arrow keys, Home/End and Page Up/Down work
 * for free and the value is announced correctly. `formatValue` keeps the unit
 * out of the component - pass px, %, ms, whatever the caller needs.
 */
const Slider = forwardRef(function Slider(
  {
    value,
    onChange,
    min = 0,
    max = 100,
    step = 1,
    disabled = false,
    showValue = true,
    formatValue = (raw) => raw,
    className = '',
    ...rest
  },
  ref,
) {
  const safeValue = Number.isFinite(Number(value)) ? Number(value) : min
  // Drives the filled portion of the track.
  const progress = max === min ? 0 : ((safeValue - min) / (max - min)) * 100

  return (
    <div className={`ui-slider ${disabled ? 'ui-slider-disabled' : ''} ${className}`.trim()}>
      <input
        ref={ref}
        type="range"
        className="ui-slider-input"
        min={min}
        max={max}
        step={step}
        value={safeValue}
        disabled={disabled}
        style={{ '--slider-progress': `${progress}%` }}
        aria-valuetext={String(formatValue(safeValue))}
        onChange={(event) => onChange?.(Number(event.target.value), event)}
        {...rest}
      />
      {showValue ? (
        <output className="ui-slider-value" aria-hidden="true">
          {formatValue(safeValue)}
        </output>
      ) : null}
    </div>
  )
})

export default Slider
