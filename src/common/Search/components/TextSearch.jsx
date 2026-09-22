import { useEffect, useMemo, useRef, useState } from 'react';
import { LoaderCircle, Search, X } from 'lucide-react';

export default function TextSearch({
  value,
  defaultValue = '',
  placeholder = 'Search...',
  onChange,
  onSearch,
  debounceMs = 400,
  loading = false,
  error,
  disabled = false,
  ariaLabel,
  clearable = true,
  noResults = false,
  emptyMessage = 'No results found.',
  className = '',
}) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const previousValueRef = useRef(defaultValue);

  const currentValue = isControlled ? value : internalValue;

  const handleChange = (nextValue) => {
    if (!isControlled) {
      setInternalValue(nextValue);
    }
    onChange?.(nextValue);
  };

  useEffect(() => {
    if (!onSearch) {
      return undefined;
    }

    const trimmedValue = currentValue ?? '';
    if (trimmedValue === previousValueRef.current) {
      return undefined;
    }

    previousValueRef.current = trimmedValue;

    const timer = setTimeout(() => {
      onSearch(trimmedValue);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [currentValue, debounceMs, onSearch]);

  const fieldClassName = useMemo(() => {
    const classes = ['search-field'];
    if (error) classes.push('search-field-error');
    if (disabled) classes.push('search-field-disabled');
    if (className) classes.push(className);
    return classes.join(' ');
  }, [error, disabled, className]);

  const showEmptyState = noResults && !loading && !error;

  return (
    <div className="search-shell">
      <div className={fieldClassName}>
        <span className="search-icon" aria-hidden="true">
          <Search size={18} />
        </span>

        <input
          type="text"
          value={currentValue}
          placeholder={placeholder}
          onChange={(event) => handleChange(event.target.value)}
          className="search-input"
          disabled={disabled}
          aria-label={ariaLabel || placeholder}
        />

        <div className="search-actions">
          {loading && (
            <span className="search-spinner" aria-label="Loading">
              <LoaderCircle size={16} />
            </span>
          )}

          {clearable && currentValue && !disabled && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => handleChange('')}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {showEmptyState && <div className="search-no-results">{emptyMessage}</div>}

      {error && (
        <div className="search-error" role="alert">
          <span aria-hidden="true">!</span>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
