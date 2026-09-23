import { useId } from 'react'

/**
 * Label + hint + error wrapper shared by every control.
 *
 * It owns the ids and the `aria-describedby` wiring, which is the part that
 * usually rots when each screen hand-rolls its own markup. `children` is a
 * function so the control receives exactly the props it must apply:
 *
 *   <FormField label="Quantity" error={errors.qty} required>
 *     {({ id, describedBy, invalid }) => (
 *       <input id={id} aria-describedby={describedBy} aria-invalid={invalid} />
 *     )}
 *   </FormField>
 */
export default function FormField({
  label,
  hint,
  error,
  required = false,
  htmlFor,
  labelAs = 'label',
  className = '',
  children,
}) {
  const generatedId = useId()
  const id = htmlFor || generatedId
  const hintId = `${id}-hint`
  const errorId = `${id}-error`

  const invalid = Boolean(error)
  const describedBy = [invalid ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ') || undefined

  // A group of controls (radios, segmented) is labelled by a span, not a label.
  const LabelTag = labelAs

  return (
    <div className={`ui-field ${className}`.trim()}>
      {label ? (
        <LabelTag
          className={`ui-label ${required ? 'ui-label-required' : ''}`.trim()}
          {...(labelAs === 'label' ? { htmlFor: id } : { id: `${id}-label` })}
        >
          {label}
        </LabelTag>
      ) : null}

      {typeof children === 'function'
        ? children({ id, describedBy, invalid, labelledBy: `${id}-label` })
        : children}

      {invalid ? (
        <p className="ui-error" id={errorId} role="alert">
          {error}
        </p>
      ) : null}
      {hint && !invalid ? (
        <p className="ui-hint" id={hintId}>
          {hint}
        </p>
      ) : null}
    </div>
  )
}
