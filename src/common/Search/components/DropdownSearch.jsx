import { useMemo, useState } from 'react';
import { Check, ChevronDown, Search, X } from 'lucide-react';

export default function DropdownSearch({
  options = [],
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  loading = false,
  emptyMessage = 'No options available.',
  ariaLabel,
  className = '',
}) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = useMemo(
    () => options.find((option) => option.value === value) ?? null,
    [options, value]
  );

  const filteredOptions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return options;

    return options.filter((option) => {
      const label = String(option.label ?? option.value ?? '').toLowerCase();
      return label.includes(normalized);
    });
  }, [options, query]);

  const handleSelect = (optionValue) => {
    if (disabled) return;
    onChange?.(optionValue);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div className={`search-shell ${className}`.trim()}>
      <div className="search-dropdown-wrap">
        <div className={`search-trigger ${disabled ? 'search-trigger-disabled' : ''}`}>
          <button
            type="button"
            className="search-trigger-main"
            onClick={() => !disabled && setIsOpen((open) => !open)}
            aria-expanded={isOpen}
            aria-label={ariaLabel || placeholder}
            disabled={disabled}
          >
            <span className={`search-trigger-value ${selectedOption ? '' : 'search-trigger-placeholder'}`}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </button>

          <span className="search-trigger-icons">
            {selectedOption && !disabled && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => onChange?.(null)}
                aria-label="Clear selection"
              >
                <X size={14} />
              </button>
            )}
            <button
              type="button"
              className="search-trigger-btn"
              onClick={() => !disabled && setIsOpen((open) => !open)}
              aria-label="Toggle options"
              disabled={disabled}
            >
              {loading ? <span className="search-spinner" aria-label="Loading"><Check size={14} /></span> : <ChevronDown size={16} />}
            </button>
          </span>
        </div>

        {isOpen && (
          <div className="search-dropdown-menu search-dropdown-menu-small" role="listbox">
            <div className="search-field" style={{ margin: '8px' }}>
              <span className="search-icon" aria-hidden="true"><Search size={16} /></span>
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="search-input"
                placeholder="Search options..."
                aria-label="Search options"
              />
            </div>

            {loading ? (
              <div className="search-no-results">Loading options...</div>
            ) : filteredOptions.length === 0 ? (
              <div className="search-no-results">{emptyMessage}</div>
            ) : (
              <ul className="search-dropdown-list">
                {filteredOptions.map((option) => {
                  const selected = option.value === value;
                  return (
                    <li key={String(option.value)}>
                      <button
                        type="button"
                        className={`search-option ${selected ? 'selected' : ''}`}
                        onClick={() => handleSelect(option.value)}
                        role="option"
                        aria-selected={selected}
                      >
                        <span className="search-option-label">
                          {selected && <span className="search-option-check"><Check size={12} /></span>}
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
  );
}
