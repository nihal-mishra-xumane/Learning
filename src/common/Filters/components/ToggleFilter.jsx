export default function ToggleFilter({ field, value = false, onChange, disabled = false, error = false }) {
  return (
    <div className="filter-field">
      {field.label && <label className="filter-field-label">{field.label}</label>}
      <button
        type="button"
        role="switch"
        aria-checked={Boolean(value)}
        aria-label={field.label || field.name}
        className="filter-switch"
        disabled={disabled}
        onClick={() => onChange(!value)}
      >
        <span className="filter-toggle-meta">
          <span className="filter-toggle-label">{field.label}</span>
          {field.description && <span className="filter-toggle-description">{field.description}</span>}
        </span>
        <span className="filter-switch-track" aria-hidden="true" />
      </button>
      {error && <p className="filter-state-message error">Unable to load toggle filter.</p>}
    </div>
  );
}
