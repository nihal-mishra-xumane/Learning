import { useMemo, useState } from 'react';
import { Check, ChevronDown, Search, X } from 'lucide-react';

const defaultOptions = [];

export default function MultiSearch({
  options = defaultOptions,
  value = [],
  onChange,
  placeholder = 'Search options...',
  disabled = false,
  loading = false,
  emptyMessage = 'No options available.',
  label = 'Options',
  className = '',
}) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredOptions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return options;
    return options.filter((option) => {
      const labelText = String(option.label ?? option.value ?? '').toLowerCase();
      return labelText.includes(normalized);
    });
  }, [options, query]);

  const selectedValues = new Set(value);

  const toggleSelection = (optionValue) => {
    if (disabled) return;

    const nextValue = selectedValues.has(optionValue)
      ? value.filter((item) => item !== optionValue)
      : [...value, optionValue];

    onChange?.(nextValue);
  };

  const selectAll = () => {
    if (disabled) return;
    onChange?.(options.map((option) => option.value));
  };

  const clearAll = () => {
    if (disabled) return;
    onChange?.([]);
  };

  const removeValue = (optionValue) => {
    if (disabled) return;
    onChange?.(value.filter((item) => item !== optionValue));
  };

  return (
    <div className={`search-shell ${className}`.trim()}>
      <div className="search-panel" aria-disabled={disabled}>
        <div className="search-panel-header">
          <span className="search-panel-title">{label}</span>
          <div className="search-panel-actions">
            <button type="button" className="search-select-action" onClick={selectAll} disabled={disabled || options.length === 0}>
              Select all
            </button>
            <button type="button" className="search-select-action" onClick={clearAll} disabled={disabled || value.length === 0}>
              Clear all
            </button>
          </div>
        </div>

        <div className="search-selected-summary" aria-live="polite">
          {value.length === 0 ? (
            <span className="search-state-label">No options selected</span>
          ) : (
            value.map((item) => {
              const match = options.find((option) => option.value === item);
              const label = match ? match.label : item;

              return (
                <span key={item} className="search-pill">
                  <span>{label}</span>
                  <button type="button" onClick={() => removeValue(item)} aria-label={`Remove ${label}`}>
                    <X size={12} />
                  </button>
                </span>
              );
            })
          )}
        </div>

        <div className="search-input-shell">
          <button
            type="button"
            className="search-trigger"
            onClick={() => !disabled && setIsOpen((current) => !current)}
            aria-expanded={isOpen}
            disabled={disabled}
          >
            <span className="search-trigger-value">
              {value.length === 0 ? <span className="search-trigger-placeholder">Select options</span> : `${value.length} selected`}
            </span>
            <span className="search-trigger-icons">
              {loading ? <span className="search-spinner" aria-label="Loading"><Check size={14} /></span> : <Search size={16} />}
              <ChevronDown size={16} />
            </span>
          </button>

          {isOpen && (
            <div className="search-dropdown-menu search-dropdown-menu-small" role="listbox" aria-multiselectable="true">
              <div className="search-field" style={{ margin: '8px' }}>
                <span className="search-icon" aria-hidden="true"><Search size={16} /></span>
                <input
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="search-input"
                  placeholder={placeholder}
                  aria-label={placeholder}
                />
              </div>

              {loading ? (
                <div className="search-no-results">Loading options...</div>
              ) : filteredOptions.length === 0 ? (
                <div className="search-no-results">{emptyMessage}</div>
              ) : (
                <ul className="search-dropdown-list">
                  {filteredOptions.map((option) => {
                    const selected = selectedValues.has(option.value);
                    return (
                      <li key={String(option.value)}>
                        <button
                          type="button"
                          className={`search-option ${selected ? 'selected' : ''}`}
                          onClick={() => toggleSelection(option.value)}
                          aria-pressed={selected}
                          role="option"
                          aria-selected={selected}
                        >
                          <span className="search-option-label">
                            <span className="search-option-check">{selected ? <Check size={12} /> : null}</span>
                            <span>{option.label}</span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
