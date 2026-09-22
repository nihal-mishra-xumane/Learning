import useRovingRadio from '../hooks/useRovingRadio'

/**
 * Single choice presented as cards, for options that are easier to recognise
 * than to read - theme mode, layout, plan tiers.
 *
 * Each option may carry a `preview` node (a small mock of what it looks like)
 * plus a label and description. Same radiogroup semantics as SegmentedControl,
 * so keyboard behaviour is identical across the system.
 */
export default function RadioCardGroup({
  options = [],
  value,
  onChange,
  label,
  labelledBy,
  disabled = false,
  columns,
  className = '',
  ...rest
}) {
  const radio = useRovingRadio({ options, value, onChange, disabled })

  return (
    <div
      role="radiogroup"
      aria-label={label}
      aria-labelledby={labelledBy}
      aria-disabled={disabled || undefined}
      className={`ui-radio-cards ${className}`.trim()}
      style={columns ? { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` } : undefined}
      {...rest}
    >
      {options.map((option, index) => (
        <button key={option.value} {...radio.getOptionProps(index)} className="ui-radio-card">
          {option.preview ? (
            <span className="ui-radio-card-preview" aria-hidden="true">
              {option.preview}
            </span>
          ) : null}
          <span className="ui-radio-card-label">
            {option.icon ? <option.icon size={14} aria-hidden="true" /> : null}
            {option.label}
          </span>
          {option.description ? (
            <span className="ui-radio-card-description">{option.description}</span>
          ) : null}
        </button>
      ))}
    </div>
  )
}
