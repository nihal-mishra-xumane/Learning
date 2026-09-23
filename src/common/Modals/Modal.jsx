import { Children, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import './Modal.css'

function ModalStep({ title, description, children, className = '', ...props }) {
  return (
    <div className={`modal__step ${className}`.trim()} {...props}>
      {title && <h3 className="modal__step-title">{title}</h3>}
      {description && <p className="modal__step-description">{description}</p>}
      {children}
    </div>
  )
}

ModalStep.displayName = 'ModalStep'

function Modal({
  isOpen = false,
  title,
  children,
  footer,
  size = 'medium',
  loading = false,
  preventClose = false,
  showCloseButton = true,
  onClose,
  closeLabel = 'Close dialog',
  steps = [],
  currentStep = 0,
  onStepChange,
  onNext,
  onPrevious,
  onFinish,
  dismissLabel = 'Dismiss',
  backLabel = 'Back',
  nextLabel = 'Next',
  finalActionLabel = 'Get Started',
  showStepDots = true,
  allowDotNavigation = true,
  className = '',
}) {
  const dialogRef = useRef(null)
  const previousFocusRef = useRef(null)
  const previousOverflowRef = useRef('')
  const closeTimerRef = useRef(null)
  const titleId = useId()
  const [shouldRender, setShouldRender] = useState(isOpen)
  const [isClosing, setIsClosing] = useState(false)

  const childSteps = Children.toArray(children).filter(
    (child) => child && typeof child === 'object' && child.type && child.type.displayName === 'ModalStep',
  )

  const hasStepContent = childSteps.length > 0 || steps.length > 0
  const totalSteps = childSteps.length > 0 ? childSteps.length : steps.length
  const safeCurrentStep = hasStepContent ? Math.min(Math.max(currentStep, 0), Math.max(totalSteps - 1, 0)) : 0
  const isFirstStep = hasStepContent ? safeCurrentStep === 0 : false
  const isLastStep = hasStepContent ? safeCurrentStep === totalSteps - 1 : false

  useEffect(() => {
    if (isOpen) {
      window.clearTimeout(closeTimerRef.current)
      setShouldRender(true)
      setIsClosing(false)
      return undefined
    }

    if (!shouldRender) return undefined

    setIsClosing(true)
    closeTimerRef.current = window.setTimeout(() => {
      setShouldRender(false)
      setIsClosing(false)
    }, 200)

    return () => window.clearTimeout(closeTimerRef.current)
  }, [isOpen, shouldRender])

  useEffect(() => {
    if (!shouldRender || isClosing) return undefined

    previousFocusRef.current = document.activeElement
    previousOverflowRef.current = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const firstFocusable = dialogRef.current?.querySelector('button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])')
    if (firstFocusable) {
      firstFocusable.focus()
    } else {
      dialogRef.current?.focus()
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && !preventClose && !loading) {
        onClose?.()
        return
      }

      if (event.key !== 'Tab') return

      const focusableElements = [...dialogRef.current.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])',
      )]

      if (!focusableElements.length) {
        event.preventDefault()
        dialogRef.current.focus()
        return
      }

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflowRef.current
      previousFocusRef.current?.focus?.()
    }
  }, [loading, onClose, preventClose, shouldRender])

  if (!shouldRender) return null

  const closeDisabled = preventClose || loading
  const titleAttribute = title ? { 'aria-labelledby': titleId } : { 'aria-label': 'Dialog' }

  const handleStepChange = (nextIndex) => {
    if (nextIndex < 0 || nextIndex >= totalSteps) return
    onStepChange?.(nextIndex)
  }

  const handleNext = () => {
    if (!hasStepContent) return
    if (isLastStep) {
      onFinish?.()
      return
    }

    const nextIndex = safeCurrentStep + 1
    onNext?.(nextIndex)
    handleStepChange(nextIndex)
  }

  const handlePrevious = () => {
    if (!hasStepContent || isFirstStep) return

    const previousIndex = safeCurrentStep - 1
    onPrevious?.(previousIndex)
    handleStepChange(previousIndex)
  }

  const activeStep = childSteps.length > 0 ? childSteps[safeCurrentStep] : steps[safeCurrentStep]
  const stepTitle = activeStep?.props?.title || activeStep?.title || title
  const stepDescription = activeStep?.props?.description || activeStep?.description
  const stepContent = activeStep?.props?.children || activeStep?.content || null

  const stepFooter = hasStepContent ? (
    <>
      {isFirstStep && onClose && !closeDisabled && (
        <button type="button" className="modal__button modal__button--secondary" onClick={onClose}>
          {dismissLabel}
        </button>
      )}
      {!isFirstStep && onClose && !closeDisabled && (
        <button type="button" className="modal__button modal__button--secondary" onClick={handlePrevious}>
          {backLabel}
        </button>
      )}
      {!isFirstStep && !isLastStep && (
        <button type="button" className="modal__button modal__button--primary" onClick={handleNext}>
          {nextLabel}
        </button>
      )}
      {isLastStep && (
        <button type="button" className="modal__button modal__button--primary" onClick={onFinish || onClose}>
          {finalActionLabel}
        </button>
      )}
      {isFirstStep && !isLastStep && (
        <button type="button" className="modal__button modal__button--primary" onClick={handleNext}>
          {nextLabel}
        </button>
      )}
    </>
  ) : null

  const renderBody = () => {
    if (hasStepContent) {
      return (
        <>
          <div className="modal__step-panel" key={safeCurrentStep}>
            {stepTitle && <h3 className="modal__step-title">{stepTitle}</h3>}
            {stepDescription && <p className="modal__step-description">{stepDescription}</p>}
            {stepContent}
          </div>

          {showStepDots && totalSteps > 1 && (
            <div className="modal__dots" aria-label="Select a step">
              {Array.from({ length: totalSteps }, (_, index) => (
                <button
                  key={index}
                  type="button"
                  aria-label={`Go to step ${index + 1}`}
                  aria-current={index === safeCurrentStep ? 'step' : undefined}
                  className={`modal__dot${index === safeCurrentStep ? ' modal__dot--active' : ''}`}
                  onClick={() => {
                    if (allowDotNavigation && index !== safeCurrentStep) {
                      handleStepChange(index)
                    }
                  }}
                />
              ))}
            </div>
          )}
        </>
      )
    }

    return children
  }

  const renderedFooter = footer || stepFooter

  return createPortal(
    <div className={`modal${isClosing ? ' modal--closing' : ''}`} role="presentation">
      <div
        className="modal__backdrop"
        aria-hidden="true"
        onMouseDown={() => {
          if (!closeDisabled) onClose?.()
        }}
      />
      <div
        ref={dialogRef}
        className={`modal__dialog modal__dialog--${size} ${className}`.trim()}
        role="dialog"
        aria-modal="true"
        {...titleAttribute}
        aria-busy={loading || undefined}
        tabIndex="-1"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="modal__header">
          {title && <h2 id={titleId}>{title}</h2>}
          {showCloseButton && !closeDisabled && (
            <button type="button" className="modal__close" aria-label={closeLabel} onClick={onClose}>
              <span aria-hidden="true">×</span>
            </button>
          )}
        </header>

        <div className={`modal__body${hasStepContent ? ' modal__body--step' : ''}`}>
          {loading && (
            <div className="modal__loading" role="status" aria-live="polite">
              <span className="modal__spinner" aria-hidden="true" />
              <span>Loading</span>
            </div>
          )}
          {renderBody()}
        </div>

        {renderedFooter && <footer className={`${hasStepContent ? 'modal__footer modal__footer--step' : 'modal__footer'}`}>{renderedFooter}</footer>}
      </div>
    </div>,
    document.body,
  )
}

Modal.Step = ModalStep

export default Modal
