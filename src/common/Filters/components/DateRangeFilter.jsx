export default function DateRangeFilter({ field, value = { from: '', to: '' }, onChange, disabled = false, error = false }) {
  const updateValue = (key, nextValue) => {
    const next = {
      from: value?.from ?? '',
      to: value?.to ?? '',
      ...value,
      [key]: nextValue,
    };

    if (next.from && next.to && next.from > next.to) {
      onChange({ ...next, [key]: nextValue, invalid: true });
      return;
    }

    onChange({
      from: next.from,
      to: next.to,
      invalid: false,
    });
  };

  const invalidRange = Boolean(value?.invalid) || (value?.from && value?.to && value.from > value.to);

  return (
    <div className="filter-field">
      {field.label && <label className="filter-field-label">{field.label}</label>}
      <div className="filter-field-group">
        <div className="filter-inline-two">
          <input
            type="date"
            className={`filter-date ${invalidRange ? 'filter-error' : ''}`}
            value={value?.from || ''}
            min={field.minDate || ''}
            max={field.maxDate || value?.to || ''}
            disabled={disabled}
            onChange={(event) => updateValue('from', event.target.value)}
          />
          <input
            type="date"
            className={`filter-date ${invalidRange ? 'filter-error' : ''}`}
            value={value?.to || ''}
            min={value?.from || field.minDate || ''}
            max={field.maxDate || ''}
            disabled={disabled}
            onChange={(event) => updateValue('to', event.target.value)}
          />
        </div>
        <button
          type="button"
          className="filter-link-button"
          onClick={() => onChange({ from: '', to: '', invalid: false })}
          disabled={disabled}
        >
          Clear
        </button>
      </div>
      {invalidRange && <p className="filter-state-message error">Start date must not be later than end date.</p>}
      {error && <p className="filter-state-message error">Unable to load date filter.</p>}
    </div>
  );
}
