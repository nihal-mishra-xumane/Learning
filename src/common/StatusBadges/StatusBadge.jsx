import './StatusBadge.css'

const defaultStatusConfig = {
  neutral: { label: 'Neutral', tone: 'neutral' },
  info: { label: 'Information', tone: 'info' },
  success: { label: 'Success', tone: 'success' },
  warning: { label: 'Warning', tone: 'warning' },
  danger: { label: 'Danger', tone: 'danger' },
}

export default function StatusBadge({
  status = 'neutral',
  label,
  statusConfig = defaultStatusConfig,
  tone,
  dot = true,
}) {
  const configuredStatus = statusConfig[status] ?? defaultStatusConfig.neutral
  const resolvedTone = tone ?? configuredStatus.tone ?? 'neutral'
  const resolvedLabel = label ?? configuredStatus.label ?? status

  return (
    <span className={`status-badge status-badge--${resolvedTone}`}>
      {dot && <span className="status-badge__dot" aria-hidden="true" />}
      <span>{resolvedLabel}</span>
    </span>
  )
}
