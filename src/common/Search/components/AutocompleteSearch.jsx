import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, LoaderCircle, Search, X } from 'lucide-react';

export default function AutocompleteSearch({
  value,
  defaultValue = '',
  placeholder = 'Search...',
  suggestions = [],
  onChange,
  onSearch,
  onSuggestionSelect,
  debounceMs = 350,
  loading = false,
  disabled = false,
  error,
  ariaLabel,
  emptyMessage = 'No suggestions found.',
  className = '',
}) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState(defaultValue || '');
  const inputRef = useRef(null);
  const previousValueRef = useRef(defaultValue);

  const currentValue = isControlled ? value : internalValue;

  const handleChange = (nextValue) => {
    if (!isControlled) {
      setInternalValue(nextValue);
    }
    onChange?.(nextValue);
    setIsOpen(true);
    setActiveIndex(-1);
  };

  useEffect(() => {
    const trimmed = (currentValue ?? '').trim();
    const timer = setTimeout(() => {
      setDebouncedQuery(trimmed);
      if (onSearch) {
        onSearch(trimmed);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [currentValue, debounceMs, onSearch]);

  useEffect(() => {
    if (debouncedQuery === previousValueRef.current) return;
    previousValueRef.current = debouncedQuery;
  }, [debouncedQuery]);

  const normalizedSuggestions = useMemo(() => {
    const query = debouncedQuery.trim().toLowerCase();

    if (!suggestions || suggestions.length === 0) {
      return [];
    }

    if (!query) {
      return suggestions.slice(0, 8);
    }

    return suggestions.filter((suggestion) => {
      const label = typeof suggestion === 'string' ? suggestion : suggestion.label;
      return label.toLowerCase().includes(query);
    });
  }, [suggestions, debouncedQuery]);

  const handleKeyDown = (event) => {
    if (!isOpen || normalizedSuggestions.length === 0) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % normalizedSuggestions.length);
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => (index <= 0 ? normalizedSuggestions.length - 1 : index - 1));
    }

    if (event.key === 'Enter' && activeIndex >= 0) {
      event.preventDefault();
      const suggestion = normalizedSuggestions[activeIndex];
      const nextValue = typeof suggestion === 'string' ? suggestion : suggestion.label;
      handleSelect(nextValue);
    }

    if (event.key === 'Escape') {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  const handleSelect = (nextValue) => {
    if (!isControlled) {
      setInternalValue(nextValue);
    }
    onChange?.(nextValue);
    onSuggestionSelect?.(nextValue);
    setIsOpen(false);
    setActiveIndex(-1);
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  const clearValue = () => {
    const nextValue = '';
    if (!isControlled) setInternalValue(nextValue);
    onChange?.(nextValue);
    setIsOpen(true);
    setActiveIndex(-1);
    inputRef.current?.focus();
  };

  return (
    <div className={`search-shell ${className}`.trim()}>
      <div className={`search-field ${error ? 'search-field-error' : ''} ${disabled ? 'search-field-disabled' : ''}`}>
        <span className="search-icon" aria-hidden="true"><Search size={18} /></span>
        <input
          ref={inputRef}
          type="text"
          value={currentValue}
          placeholder={placeholder}
          onChange={(event) => handleChange(event.target.value)}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 120)}
          onKeyDown={handleKeyDown}
          className="search-input"
          disabled={disabled}
          aria-label={ariaLabel || placeholder}
          aria-expanded={isOpen}
          aria-controls="autocomplete-listbox"
          role="combobox"
          aria-autocomplete="list"
        />

        <div className="search-actions">
          {loading && (
            <span className="search-spinner" aria-label="Loading"><LoaderCircle size={16} /></span>
          )}
          {!disabled && currentValue && (
            <button type="button" className="search-clear-btn" onClick={clearValue} aria-label="Clear search">
              <X size={16} />
            </button>
          )}
          <button type="button" className="search-trigger-btn" aria-label="Toggle suggestions" onClick={() => setIsOpen((open) => !open)}>
            <ChevronDown size={16} />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="search-dropdown-menu" role="listbox" id="autocomplete-listbox">
          {loading ? (
            <div className="search-no-results">Loading suggestions...</div>
          ) : normalizedSuggestions.length === 0 ? (
            <div className="search-no-results">{emptyMessage}</div>
          ) : (
            <ul className="search-dropdown-list">
              {normalizedSuggestions.map((suggestion, index) => {
                const label = typeof suggestion === 'string' ? suggestion : suggestion.label;
                const value = typeof suggestion === 'string' ? suggestion : suggestion.value ?? suggestion.label;
                return (
                  <li key={String(value)}>
                    <button
                      type="button"
                      className={`search-option ${index === activeIndex ? 'active' : ''}`}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => handleSelect(label)}
                      role="option"
                      aria-selected={index === activeIndex}
                    >
                      <span className="search-option-label">{label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {error && (
        <div className="search-error" role="alert">
          <span aria-hidden="true">!</span>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
