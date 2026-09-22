import { formatChipLabel, isFilterActive } from './filterUtils';

export default function FilterChips({ fields = [], value = {}, onChange, onClearAll }) {
  const chips = fields.filter((field) => isFilterActive(field, value?.[field.name])).map((field) => ({
    field,
    label: formatChipLabel(field, value?.[field.name]),
    value: value?.[field.name],
  }));

  if (!chips.length) {
    return null;
  }

  const removeChip = (field) => {
    const nextValue = { ...value };

    if (field.type === 'multi' || field.type === 'checkbox') {
      nextValue[field.name] = [];
    } else if (field.type === 'dateRange') {
      nextValue[field.name] = { from: '', to: '', invalid: false };
    } else if (field.type === 'range') {
      nextValue[field.name] = { min: '', max: '' };
    } else if (field.type === 'toggle') {
      nextValue[field.name] = false;
    } else {
      nextValue[field.name] = '';
    }

    onChange(field.name, nextValue[field.name]);
  };

  return (
    <div className="filter-field">
      <label className="filter-field-label">Active Filters</label>
      <div className="filter-chip-wrap">
        {chips.map(({ field, label }) => (
          <span key={field.name} className="filter-chip">
            <span>{field.label}: {label}</span>
            <button type="button" className="filter-chip-remove" aria-label={`Remove ${field.label}`} onClick={() => removeChip(field)}>
              ×
            </button>
          </span>
        ))}
        <button type="button" className="filter-chip-clear-all" onClick={onClearAll}>
          Clear all
        </button>
      </div>
    </div>
  );
}
