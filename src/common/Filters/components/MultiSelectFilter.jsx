import { useMemo, useState } from 'react';

export default function MultiSelectFilter({ field, value = [], onChange, disabled = false, loading = false, error = false }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const options = field.options || [];
  const filteredOptions = useMemo(
    () =>
      options.filter((option) =>
        option.label.toLowerCase().includes(query.toLowerCase()) || String(option.value).toLowerCase().includes(query.toLowerCase())
      ),
    [options, query]
  );

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
        <button
          type="button"
          className={`filter-control ${error ? 'filter-control--error' : ''}`}
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          disabled={disabled || loading}
        >
          {loading ? 'Loading...' : `${(value || []).length} selected`}
        </button>

        {open && !disabled && (
          <div className="filter-list" aria-label={field.label || field.name}>
            <input
              type="text"
              className="filter-text-input"
              placeholder="Search options..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <div className="filter-list-actions">
              <button type="button" className="filter-link-button" onClick={() => onChange(options.map((option) => option.value))}>
                Select all
              </button>
              <button type="button" className="filter-link-button" onClick={() => onChange([])}>
                Clear all
              </button>
            </div>
            {filteredOptions.length ? (
              filteredOptions.map((option) => (
                <label key={option.value} className="filter-option" aria-label={option.label}>
                  <input
                    type="checkbox"
                    checked={(value || []).includes(option.value)}
                    onChange={() => toggleValue(option.value)}
                  />
                  <span className="filter-option-text">{option.label}</span>
                </label>
              ))
            ) : (
              <p className="filter-state-message">No options found.</p>
            )}
          </div>
        )}
      </div>
      {error && <p className="filter-state-message error">Unable to load options.</p>}
    </div>
  );
}
