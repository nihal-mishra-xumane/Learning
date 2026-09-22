export default function RangeFilter({ field, value = { min: '', max: '' }, onChange, disabled = false, error = false }) {
  const minValue = Number(field.min ?? 0);
  const maxValue = Number(field.max ?? 100);
  const step = Number(field.step ?? 1);

  const updateValue = (type, nextValue) => {
    const next = { min: value?.min ?? '', max: value?.max ?? '' };
    next[type] = nextValue;
    onChange(next);
  };

  return (
    <div className="filter-field">
      {field.label && <label className="filter-field-label">{field.label}</label>}
      <div className="filter-field-group">
        <div className="filter-inline-two">
          <input
            type="number"
            className="filter-number"
            placeholder="Min"
            value={value?.min ?? ''}
            min={minValue}
            max={maxValue}
            step={step}
            disabled={disabled}
            onChange={(event) => updateValue('min', event.target.value)}
          />
          <input
            type="number"
            className="filter-number"
            placeholder="Max"
            value={value?.max ?? ''}
            min={minValue}
            max={maxValue}
            step={step}
            disabled={disabled}
            onChange={(event) => updateValue('max', event.target.value)}
          />
        </div>
        <button type="button" className="filter-link-button" onClick={() => onChange({ min: '', max: '' })} disabled={disabled}>
          Clear
        </button>
      </div>
      {error && <p className="filter-state-message error">Unable to load range filter.</p>}
    </div>
  );
}
