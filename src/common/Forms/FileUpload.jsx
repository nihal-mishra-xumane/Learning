import { Upload } from 'lucide-react'
import { forwardRef, useId } from 'react'
import FormField, { getDescriptionIds } from './FormField'

const FileUpload = forwardRef(function FileUpload(
  {
    id,
    label = 'Upload file',
    description,
    error = false,
    errorMessage,
    warning = false,
    warningMessage,
    success = false,
    successMessage,
    helperText,
    accept,
    multiple = false,
    className = '',
    required = false,
    ...props
  },
  ref,
) {
  const generatedId = useId()
  const uploadId = id || `file-${generatedId}`
  const descriptionIds = getDescriptionIds(uploadId, error, errorMessage, helperText || description, warning, warningMessage, success, successMessage)

  return (
    <FormField id={uploadId} label={label} required={required} error={error} errorMessage={errorMessage} warning={warning} warningMessage={warningMessage} success={success} successMessage={successMessage} helperText={helperText || description} fullWidth>
      <label className={`common-upload ${className}`.trim()} htmlFor={uploadId}>
        <Upload size={20} aria-hidden="true" />
        <span><strong>Choose {multiple ? 'files' : 'a file'}</strong><small>or drag and drop</small></span>
        <input ref={ref} id={uploadId} type="file" accept={accept} multiple={multiple} required={required} aria-invalid={error || undefined} aria-describedby={descriptionIds} {...props} />
      </label>
    </FormField>
  )
})

export default FileUpload
