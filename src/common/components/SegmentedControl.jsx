import useRovingRadio from '../hooks/useRovingRadio'

/**
 * Accessible segmented control - a radio group that looks like a button strip.
 *
 * Generic on purpose: it knows nothing about themes, procurement or CRM. Pass
 * options in, get the selected value out. Tabs, filters and view switchers can
 * all reuse it.
 */
export default function SegmentedControl({
  options = [],
  value,
  onChange,
  label,
  labelledBy,
  size = 'sm',
  iconOnly = false,
  disabled = false,
  fullWidth = false,
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
      className={[
        'ui-segmented',
        iconOnly ? 'ui-segmented-icon-only' : '',
        fullWidth ? 'ui-segmented-block' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {options.map((option, index) => {
        const Icon = option.icon
        return (
          <button
            key={option.value}
            {...radio.getOptionProps(index)}
            // Icon-only buttons still need a name for screen readers.
            aria-label={iconOnly ? option.label : undefined}
            title={iconOnly ? option.label : undefined}
            className={`ui-segmented-option ui-segmented-option-${size}`}
          >
            {Icon ? <Icon size={14} aria-hidden="true" /> : null}
            {iconOnly ? null : option.label}
          </button>
        )
      })}
    </div>
  )
}
