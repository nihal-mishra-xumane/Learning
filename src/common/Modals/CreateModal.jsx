import { useEffect, useState } from 'react'
import Modal from './Modal'
import './DataModals.css'

function getInitialValues(fields) {
  return fields.reduce((values, field) => ({
    ...values,
    [field.name]: field.defaultValue ?? (field.type === 'checkbox' ? false : ''),
  }), {})
}

function validateFields(fields, values) {
  return fields.reduce((errors, field) => {
    const value = values[field.name]
    if (field.required && (!value || (typeof value === 'string' && !value.trim()))) {
      errors[field.name] = `${field.label} is required.`
    }
    if (field.validate) {
      const customError = field.validate(value, values)
      if (customError) errors[field.name] = customError
    }
    return errors
  }, {})
}

export default function CreateModal({
  open,
  isOpen,
  title = 'Create item',
  description,
  fields = [],
  submitText = 'Create',
  cancelText = 'Cancel',
  onClose,
  onSubmit,
  eyebrow,
  savingText = 'Saving...',
}) {
  const visible = open ?? isOpen
  const [values, setValues] = useState(() => getInitialValues(fields))
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (visible) {
      setValues(getInitialValues(fields))
      setErrors({})
      setIsSubmitting(false)
    }
  }, [visible])

  const updateValue = (field, value) => {
    setValues((currentValues) => ({ ...currentValues, [field.name]: value }))
    setErrors((currentErrors) => ({ ...currentErrors, [field.name]: '' }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = validateFields(fields, values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    setIsSubmitting(true)
    try {
      await onSubmit?.(values)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderField = (field) => {
    const commonProps = {
      id: field.name,
      name: field.name,
      disabled: isSubmitting || field.disabled,
      required: field.required,
      'aria-invalid': Boolean(errors[field.name]),
      'aria-describedby': errors[field.name] ? `${field.name}-error` : undefined,
    }

    if (field.render) return field.render({ field, value: values[field.name], onChange: (value) => updateValue(field, value), disabled: isSubmitting })
    if (field.type === 'textarea') return <textarea {...commonProps} value={values[field.name]} placeholder={field.placeholder} rows={field.rows || 3} onChange={(event) => updateValue(field, event.target.value)} />
    if (field.type === 'select') return <select {...commonProps} value={values[field.name]} onChange={(event) => updateValue(field, event.target.value)}><option value="">{field.placeholder || `Select ${field.label.toLowerCase()}`}</option>{field.options?.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
    if (field.type === 'checkbox') return <input {...commonProps} type="checkbox" checked={Boolean(values[field.name])} onChange={(event) => updateValue(field, event.target.checked)} />
    return <input {...commonProps} type={field.type || 'text'} value={values[field.name]} placeholder={field.placeholder} onChange={(event) => updateValue(field, event.target.value)} />
  }

  return (
    <Modal isOpen={visible} onClose={onClose} title={title} size="medium" loading={isSubmitting} className="modal__dialog--data">
      <form className="data-modal" onSubmit={handleSubmit} noValidate>
        <div className="data-modal__intro">
          {eyebrow && <span className="data-modal__eyebrow">{eyebrow}</span>}
          {description && <p>{description}</p>}
        </div>
        <div className="data-modal__fields">
          {fields.map((field) => (
            <label className={`data-modal__field${field.type === 'checkbox' ? ' data-modal__field--checkbox' : ''}`} key={field.name} htmlFor={field.name}>
              {field.type === 'checkbox' ? <>{renderField(field)}<span>{field.label}</span></> : <><span>{field.label}{field.required && <b> *</b>}</span>{renderField(field)}</>}
              {errors[field.name] && <small id={`${field.name}-error`}>{errors[field.name]}</small>}
            </label>
          ))}
        </div>
        <div className="data-modal__actions">
          <button type="button" className="data-modal__button data-modal__button--secondary" onClick={onClose} disabled={isSubmitting}>{cancelText}</button>
          <button type="submit" className="data-modal__button data-modal__button--primary" disabled={isSubmitting}>{isSubmitting ? savingText : submitText}</button>
        </div>
      </form>
    </Modal>
  )
}
