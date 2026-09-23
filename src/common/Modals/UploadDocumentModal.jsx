import { useEffect, useRef, useState } from 'react'
import Modal from './Modal'
import './DataModals.css'

export default function UploadDocumentModal({
  open,
  isOpen,
  title = 'Upload document',
  description = 'Add a file to keep your workspace organized.',
  eyebrow,
  dropText = 'Drop a file here',
  browseText = 'or click to browse from your device',
  uploadText = 'Upload',
  uploadingText = 'Uploading...',
  noFileMessage = 'Choose a file to upload.',
  fileTypesText,
  accept = '.pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg',
  maxSize = 10 * 1024 * 1024,
  onClose,
  onUpload,
}) {
  const visible = open ?? isOpen
  const inputRef = useRef(null)
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    if (visible) {
      setFile(null)
      setError('')
      setIsUploading(false)
    }
  }, [visible])

  const chooseFile = (nextFile) => {
    if (!nextFile) return
    if (nextFile.size > maxSize) {
      setError(`Choose a file smaller than ${Math.round(maxSize / 1024 / 1024)} MB.`)
      return
    }
    setError('')
    setFile(nextFile)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!file) {
      setError(noFileMessage)
      return
    }
    setIsUploading(true)
    try {
      await onUpload?.(file)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Modal isOpen={visible} onClose={onClose} title={title} size="medium" loading={isUploading} className="modal__dialog--data">
      <form className="data-modal" onSubmit={handleSubmit}>
        <div className="data-modal__intro">
          {eyebrow && <span className="data-modal__eyebrow">{eyebrow}</span>}
          {description && <p>{description}</p>}
        </div>
        <button
          type="button"
          className={`data-modal__upload-zone${isDragging ? ' data-modal__upload-zone--dragging' : ''}${error ? ' data-modal__upload-zone--error' : ''}`}
          onClick={() => inputRef.current?.click()}
          onDragEnter={(event) => { event.preventDefault(); setIsDragging(true) }}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(event) => { event.preventDefault(); setIsDragging(false); chooseFile(event.dataTransfer.files[0]) }}
        >
          <span className="data-modal__upload-zone-icon" aria-hidden="true">↑</span>
          <strong>{file ? file.name : dropText}</strong>
          <span>{file ? `${Math.ceil(file.size / 1024)} KB selected` : browseText}</span>
          {fileTypesText && <small>{fileTypesText} up to {Math.round(maxSize / 1024 / 1024)} MB</small>}
        </button>
        <input ref={inputRef} className="data-modal__upload-zone-input" type="file" accept={accept} onChange={(event) => chooseFile(event.target.files[0])} />
        {error && <p className="data-modal__error" role="alert">{error}</p>}
        <div className="data-modal__actions">
          <button type="button" className="data-modal__button data-modal__button--secondary" onClick={onClose} disabled={isUploading}>Cancel</button>
          <button type="submit" className="data-modal__button data-modal__button--primary" disabled={isUploading}>{isUploading ? uploadingText : uploadText}</button>
        </div>
      </form>
    </Modal>
  )
}
