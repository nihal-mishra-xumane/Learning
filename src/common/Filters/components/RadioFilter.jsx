export default function RadioFilter({ field, value = '', onChange, disabled = false, error = false }) {
  const options = field.options || [];

  return (
    <div className="filter-field">
      {field.label && <label className="filter-field-label">{field.label}</label>}
      <div className="filter-field-group">
        <div className="filter-list">
          {options.length ? (
            options.map((option) => (
              <label key={option.value} className="filter-option" aria-label={option.label}>
                <input
                  type="radio"
                  name={field.name}
                  value={option.value}
                  checked={String(value) === String(option.value)}
                  disabled={disabled}
                  onChange={() => onChange(option.value)}
                />
                <span className="filter-option-text">{option.label}</span>
              </label>
            ))
          ) : (
            <p className="filter-state-message">No options available.</p>
          )}
        </div>
        <button type="button" className="filter-link-button" onClick={() => onChange('')} disabled={disabled}>
          Clear
        </button>
      </div>
      {error && <p className="filter-state-message error">Unable to load options.</p>}
    </div>
  );
}
