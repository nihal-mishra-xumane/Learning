import { useEffect, useMemo, useState } from 'react';
import './Filters.css';
import SelectFilter from './components/SelectFilter';
import MultiSelectFilter from './components/MultiSelectFilter';
import CheckboxFilter from './components/CheckboxFilter';
import RadioFilter from './components/RadioFilter';
import DateRangeFilter from './components/DateRangeFilter';
import RangeFilter from './components/RangeFilter';
import ToggleFilter from './components/ToggleFilter';
import FilterChips from './components/FilterChips';
import {
  countActiveFilters,
  createDefaultFilterState,
  normalizeFilterState,
} from './components/filterUtils';

const fieldComponentMap = {
  select: SelectFilter,
  multi: MultiSelectFilter,
  checkbox: CheckboxFilter,
  radio: RadioFilter,
  dateRange: DateRangeFilter,
  range: RangeFilter,
  toggle: ToggleFilter,
};

export function Filters({
  fields = [],
  value = {},
  onChange = () => {},
  onApply,
  onReset,
  mode = 'immediate',
  className = '',
  title = 'Filters',
  applyLabel = 'Apply Filters',
  resetLabel = 'Reset',
  disabled = false,
}) {
  const initialState = useMemo(() => normalizeFilterState(fields, value), [fields, value]);
  const [draft, setDraft] = useState(initialState);

  useEffect(() => {
    setDraft(normalizeFilterState(fields, value));
  }, [fields, value]);

  const updateField = (fieldName, fieldValue) => {
    const nextValue = { ...draft, [fieldName]: fieldValue };
    setDraft(nextValue);

    if (mode === 'immediate') {
      onChange(nextValue);
    }
  };

  const handleApply = () => {
    const nextValue = normalizeFilterState(fields, draft);
    setDraft(nextValue);
    onChange(nextValue);

    if (onApply) {
      onApply(nextValue);
    }
  };

  const handleReset = () => {
    const resetValue = createDefaultFilterState(fields);
    setDraft(resetValue);
    onChange(resetValue);

    if (onReset) {
      onReset(resetValue);
    }
  };

  const activeCount = countActiveFilters(fields, draft);

  const renderField = (field) => {
    const Component = fieldComponentMap[field.type] || SelectFilter;
    const fieldProps = {
      field,
      value: draft[field.name],
      onChange: (nextValue) => updateField(field.name, nextValue),
      disabled: Boolean(disabled || field.disabled),
      loading: Boolean(field.loading),
      error: Boolean(field.error),
    };

    return <Component key={field.name || field.label || field.type} {...fieldProps} />;
  };

  return (
    <div className={`filter-shell ${className}`.trim()}>
      <div className="filter-panel">
        <div className="filter-panel-header">
          <div className="filter-panel-title-wrap">
            <h3 className="filter-panel-title">{title}</h3>
            {activeCount > 0 && <span className="filter-active-badge">{activeCount}</span>}
          </div>
        </div>

        <div className="filter-grid">{fields.map(renderField)}</div>

        <div className="filter-action-row">
          <button type="button" className="filter-button" onClick={handleReset} disabled={disabled}>
            {resetLabel}
          </button>
          <button type="button" className="filter-button primary" onClick={handleApply} disabled={disabled}>
            {applyLabel}
          </button>
        </div>
      </div>

      <FilterChips
        fields={fields}
        value={draft}
        onChange={(fieldName, nextValue) => {
          const updated = { ...draft, [fieldName]: nextValue };
          setDraft(updated);
          onChange(updated);
        }}
        onClearAll={() => {
          const resetValue = createDefaultFilterState(fields);
          setDraft(resetValue);
          onChange(resetValue);
        }}
      />
    </div>
  );
}

export default Filters;
