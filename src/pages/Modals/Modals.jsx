import { useEffect, useRef, useState } from 'react'
import Modal, { AuthModal, CreateModal, UploadDocumentModal } from '../../common/Modals'
import './Modals.css'

const modalExamples = [
  { id: 'basic', label: 'Basic modal', title: 'Basic modal', size: 'medium' },
  { id: 'confirmation', label: 'Confirmation modal', title: 'Confirmation', size: 'small' },
  { id: 'small', label: 'Small modal', title: 'Small modal', size: 'small' },
  { id: 'medium', label: 'Medium modal', title: 'Medium modal', size: 'medium' },
  { id: 'large', label: 'Large modal', title: 'Large modal', size: 'large' },
  { id: 'prevent', label: 'Prevent close modal', title: 'Prevent accidental close', size: 'medium' },
  { id: 'long', label: 'Long content modal', title: 'Scrollable details', size: 'large' },
  { id: 'crm', label: 'Customer details', title: 'Customer details', size: 'large' },
  { id: 'procurement', label: 'Supplier details', title: 'Supplier details', size: 'large' },
  { id: 'media', label: 'Media modal', title: 'Media content', size: 'medium' },
  { id: 'no-close', label: 'Hidden close button', title: 'Action required', size: 'small' },
  { id: 'onboarding', label: 'Onboarding modal', title: '', size: 'medium' },
]

const onboardingSteps = [
  {
    title: 'Welcome to Our Website',
    description: 'A short introduction explaining what the website does and how it helps you move faster.',
    content: <p>Discover the tools, insights, and workflows designed to make daily work clearer and more productive.</p>,
  },
  {
    title: 'Explore Your Dashboard',
    description: 'See the main areas where you can track progress, manage tasks, and stay informed in one place.',
    content: (
      <>
        <img
          className="modal__media modal__onboarding-media"
          src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80"
          alt="Team collaborating around a table"
        />
        <p>Use the dashboard to monitor activity, focus on priorities, and quickly access the information that matters most.</p>
      </>
    ),
  },
  {
    title: "You're All Set!",
    description: 'Everything is ready to go. Start exploring and take the next step with confidence.',
    content: <p>Your workspace is prepared for a smooth start. Jump in and begin using the experience we designed for you.</p>,
  },
]

export default function ModalsPage() {
  const [activeModal, setActiveModal] = useState(null)
  const [loading, setLoading] = useState(false)
  const [onboardingStep, setOnboardingStep] = useState(0)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const loadingTimerRef = useRef(null)

  useEffect(() => () => window.clearTimeout(loadingTimerRef.current), [])

  const closeModal = () => {
    if (!loading) setActiveModal(null)
  }

  const openOnboardingModal = () => {
    setOnboardingStep(0)
    setActiveModal('onboarding')
  }

  const showLoadingModal = () => {
    setActiveModal('loading')
    setLoading(true)
    loadingTimerRef.current = window.setTimeout(() => {
      setLoading(false)
    }, 1800)
  }

  const handleAuthSubmit = async () => {
    await new Promise((resolve) => window.setTimeout(resolve, 900))
    setIsAuthModalOpen(false)
  }

  const customerFields = [
    { name: 'name', label: 'Customer name', required: true, placeholder: 'e.g. Acme Inc.' },
    { name: 'email', label: 'Email address', type: 'email', required: true, placeholder: 'name@company.com' },
    { name: 'segment', label: 'Segment', type: 'select', required: true, options: [{ value: 'enterprise', label: 'Enterprise' }, { value: 'growth', label: 'Growth' }, { value: 'startup', label: 'Startup' }] },
    { name: 'joined', label: 'Start date', type: 'date' },
  ]

  const activeExample = modalExamples.find((example) => example.id === activeModal)
  const modalTitle = activeExample?.title ?? 'Loading modal'
  const modalSize = activeExample?.size ?? 'medium'
  const preventClose = activeModal === 'prevent'
  const showCloseButton = activeModal !== 'no-close'

  return (
    <div className="demo-page demo-page--modals">
      <div className="page-heading">
        <p className="eyebrow">Common / Modals</p>
        <h1>Modals</h1>
        <p>A configurable dialog for focused content, actions, and temporary workflows.</p>
      </div>

      <section className="component-section" aria-labelledby="modal-examples-heading">
        <div className="section-heading">
          <h2 id="modal-examples-heading">Examples</h2>
          <p>The page controls open state, loading state, and the actions supplied to each modal.</p>
        </div>
        <div className="demo-actions">
          {modalExamples.map((example) => (
            <button key={example.id} type="button" onClick={() => (example.id === 'onboarding' ? openOnboardingModal() : setActiveModal(example.id))}>
              {example.label}
            </button>
          ))}
          <button type="button" onClick={showLoadingModal}>Loading modal</button>
          <button type="button" onClick={() => setIsAuthModalOpen(true)}>Authentication modal</button>
          <button type="button" onClick={() => setIsCreateModalOpen(true)}>Create modal</button>
          <button type="button" onClick={() => setIsUploadModalOpen(true)}>Upload document</button>
        </div>
      </section>

      <section className="component-section" aria-labelledby="modal-usage-heading">
        <div className="section-heading">
          <h2 id="modal-usage-heading">Usage</h2>
          <p><code>isOpen</code>, <code>onClose</code>, <code>title</code>, <code>children</code>, and <code>footer</code> are supplied by the consuming page. Use <code>size</code>, <code>loading</code>, and <code>preventClose</code> for behavior and presentation.</p>
        </div>
      </section>

      <Modal
        isOpen={Boolean(activeModal) && activeModal !== 'onboarding'}
        title={modalTitle}
        size={modalSize}
        loading={loading}
        preventClose={preventClose}
        showCloseButton={showCloseButton}
        onClose={closeModal}
        footer={
          <>
            <button type="button" disabled={loading} onClick={closeModal}>Close</button>
            {activeModal === 'confirmation' && (
              <button type="button" disabled={loading} onClick={closeModal}>Confirm</button>
            )}
            {preventClose && (
              <button type="button" disabled={loading} onClick={() => setActiveModal(null)}>Done</button>
            )}
          </>
        }
      >
        {activeModal === 'confirmation' ? (
          <p>This is a generic confirmation message supplied by the page.</p>
        ) : activeModal === 'crm' ? (
          <div>
            <p>Reusable modal content can present details for any application module.</p>
            <p><strong>Reference:</strong> Example customer record</p>
            <p><strong>Status:</strong> Active</p>
          </div>
        ) : activeModal === 'procurement' ? (
          <div>
            <p>The same Modal component can present supplier information without domain-specific props.</p>
            <p><strong>Reference:</strong> Example supplier record</p>
            <p><strong>Review:</strong> Ready for review</p>
          </div>
        ) : activeModal === 'media' ? (
          <div>
            <img
              className="modal__media"
              src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80"
              alt="Bright workspace with desks and plants"
            />
            <p className="modal__media-caption">Images, video, and other custom React content can be placed directly inside the modal body.</p>
          </div>
        ) : activeModal === 'large' ? (
          <div>
            <p>Large dialogs can contain richer content while remaining scrollable.</p>
            <p>{'Additional content helps demonstrate the available space. '.repeat(8)}</p>
          </div>
        ) : activeModal === 'long' ? (
          <div>
            <p>The header and footer remain fixed while this content area scrolls.</p>
            <p>{'Long content stays within the viewport and remains readable. '.repeat(35)}</p>
          </div>
        ) : activeModal === 'prevent' ? (
          <p>Use the action below to close this modal. Backdrop clicks, Escape, and the close icon are disabled.</p>
        ) : activeModal === 'no-close' ? (
          <p>This example hides the close button. The consuming page provides the action that closes it.</p>
        ) : (
          <p>This content is supplied by the page using the reusable Modal component.</p>
        )}
      </Modal>

      <Modal
        isOpen={activeModal === 'onboarding'}
        size="medium"
        showCloseButton
        onClose={() => setActiveModal(null)}
        currentStep={onboardingStep}
        onStepChange={setOnboardingStep}
        onFinish={() => setActiveModal(null)}
        dismissLabel="Dismiss"
        backLabel="Back"
        nextLabel="Next"
        finalActionLabel="Get Started"
        allowDotNavigation
        steps={onboardingSteps}
      />

      <AuthModal
        open={isAuthModalOpen}
        mode="login"
        brand="Northstar"
        promoEyebrow="Good to see you again"
        loginPromoTitle="Welcome back"
        signupPromoTitle="Join us today"
        loginPromoText="Sign in to continue and access all the features available to you."
        signupPromoText="Create your account and unlock everything the platform has to offer."
        formEyebrow="Your workspace"
        loginTitle="Welcome back"
        signupTitle="Get started"
        loginDescription="Enter your details to pick up where you left off."
        signupDescription="Start with a free account in just a few moments."
        promoFoot="Simple tools. Clear progress. More momentum."
        onClose={() => setIsAuthModalOpen(false)}
        onSubmit={handleAuthSubmit}
        onGoogleSignIn={() => setIsAuthModalOpen(false)}
      />

      <CreateModal
        open={isCreateModalOpen}
        title="Add Customer"
        description="Add a new customer to your database."
        eyebrow="New record"
        fields={customerFields}
        submitText="Add customer"
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={async () => {
          await new Promise((resolve) => window.setTimeout(resolve, 700))
          setIsCreateModalOpen(false)
        }}
      />

      <UploadDocumentModal
        open={isUploadModalOpen}
        eyebrow="File library"
        fileTypesText="PDF, Word, Excel, PNG or JPG"
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={async () => {
          await new Promise((resolve) => window.setTimeout(resolve, 700))
          setIsUploadModalOpen(false)
        }}
      />
    </div>
  )
}
