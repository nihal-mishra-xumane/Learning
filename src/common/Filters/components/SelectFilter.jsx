import { useMemo, useState } from 'react';

export default function SelectFilter({
  field,
  value,
  onChange,
  disabled = false,
  loading = false,
  error = false,
}) {
  const [open, setOpen] = useState(false);
  const options = field.options || [];
  const selectedOption = useMemo(
    () => options.find((option) => String(option.value) === String(value)) || null,
    [options, value]
  );

  return (
    <div className="filter-field">
      {field.label && <label className="filter-field-label">{field.label}</label>}
      <div className="filter-field-group">
        <button
          type="button"
          className={`filter-control ${error ? 'filter-control--error' : ''}`}
          aria-label={field.label || field.name}
          aria-expanded={open}
          disabled={disabled || loading}
          onClick={() => setOpen((prev) => !prev)}
        >
          {loading ? 'Loading...' : selectedOption ? selectedOption.label : field.placeholder || 'Select an option'}
        </button>

        {open && !disabled && (
          <div className="filter-list" role="listbox" aria-label={field.label || field.name}>
            <button
              type="button"
              className="filter-option"
              onClick={() => {
                onChange('');
                setOpen(false);
              }}
            >
              <span className="filter-option-text">Clear selection</span>
            </button>
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                className="filter-option"
                role="option"
                aria-selected={String(option.value) === String(value)}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
              >
                <span className="filter-option-text">{option.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      {error && <p className="filter-state-message error">Unable to load options.</p>}
    </div>
  );
}
