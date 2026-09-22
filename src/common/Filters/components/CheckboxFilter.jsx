export default function CheckboxFilter({ field, value = [], onChange, disabled = false, error = false }) {
  const options = field.options || [];

  const toggleValue = (optionValue) => {
    const selected = new Set(value || []);
    if (selected.has(optionValue)) {
      selected.delete(optionValue);
    } else {
      selected.add(optionValue);
    }
    onChange([...selected]);
  };

  return (
    <div className="filter-field">
      {field.label && <label className="filter-field-label">{field.label}</label>}
      <div className="filter-field-group">
        <div className="filter-list">
          {options.length ? (
            options.map((option) => (
              <label key={option.value} className="filter-option" aria-label={option.label}>
                <input
                  type="checkbox"
                  checked={(value || []).includes(option.value)}
                  disabled={disabled}
                  onChange={() => toggleValue(option.value)}
                />
                <span className="filter-option-text">{option.label}</span>
              </label>
            ))
          ) : (
            <p className="filter-state-message">No options available.</p>
          )}
        </div>
      </div>
      {error && <p className="filter-state-message error">Unable to load options.</p>}
    </div>
  );
}
