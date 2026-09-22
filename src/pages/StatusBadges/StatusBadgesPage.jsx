import StatusBadge from '../../common/StatusBadges/StatusBadge'

const commonStatuses = ['neutral', 'info', 'success', 'warning', 'danger']

const reviewStatusConfig = {
  draft: { label: 'Draft', tone: 'neutral' },
  review: { label: 'In review', tone: 'info' },
  approved: { label: 'Approved', tone: 'success' },
  changes: { label: 'Changes requested', tone: 'warning' },
}

export default function StatusBadgesPage() {
  return (
    <div className="status-page">
      <div className="page-heading">
        <p className="eyebrow">Common / Status Badges</p>
        <h1>Status badges</h1>
        <p>Compact, readable feedback for states that need a quick visual signal.</p>
      </div>

      <section className="component-section" aria-labelledby="common-statuses-heading">
        <div className="section-heading">
          <h2 id="common-statuses-heading">Common status types</h2>
          <p>Use semantic statuses when the meaning is shared across the product.</p>
        </div>
        <div className="badge-row">
          {commonStatuses.map((status) => (
            <StatusBadge key={status} status={status} />
          ))}
        </div>
      </section>

      <section className="component-section" aria-labelledby="configured-statuses-heading">
        <div className="section-heading">
          <h2 id="configured-statuses-heading">Configurable status</h2>
          <p>Supply your own status vocabulary without adding business logic to the component.</p>
        </div>
        <div className="badge-row">
          {Object.keys(reviewStatusConfig).map((status) => (
            <StatusBadge key={status} status={status} statusConfig={reviewStatusConfig} />
          ))}
        </div>
      </section>
    </div>
  )
}
