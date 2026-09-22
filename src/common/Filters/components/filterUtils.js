export function getDefaultFieldValue(field) {
  switch (field?.type) {
    case 'multi':
    case 'checkbox':
      return [];
    case 'dateRange':
      return { from: '', to: '' };
    case 'range':
      return { min: '', max: '' };
    case 'toggle':
      return false;
    case 'radio':
      return '';
    case 'select':
    default:
      return '';
  }
}

export function normalizeFilterState(fields = [], value = {}) {
  const normalized = {};

  fields.forEach((field) => {
    const key = field.name;
    const current = value[key];

    if (field.type === 'dateRange') {
      normalized[key] = {
        from: current?.from ?? '',
        to: current?.to ?? '',
      };
      return;
    }

    if (field.type === 'range') {
      normalized[key] = {
        min: current?.min ?? field.min ?? '',
        max: current?.max ?? field.max ?? '',
      };
      return;
    }

    if (field.type === 'multi' || field.type === 'checkbox') {
      normalized[key] = Array.isArray(current) ? current : [];
      return;
    }

    normalized[key] = current ?? getDefaultFieldValue(field);
  });

  return normalized;
}

export function createDefaultFilterState(fields = []) {
  const defaults = {};

  fields.forEach((field) => {
    defaults[field.name] = getDefaultFieldValue(field);
  });

  return defaults;
}

export function isFilterActive(field, value) {
  if (!field || field.name === undefined) {
    return false;
  }

  if (field.type === 'multi' || field.type === 'checkbox') {
    return Array.isArray(value) && value.length > 0;
  }

  if (field.type === 'dateRange') {
    return Boolean(value?.from || value?.to);
  }

  if (field.type === 'range') {
    const min = value?.min ?? '';
    const max = value?.max ?? '';
    return min !== '' || max !== '';
  }

  if (field.type === 'toggle') {
    return Boolean(value);
  }

  if (typeof value === 'string') {
    return value.trim().length > 0;
  }

  return Boolean(value);
}

export function countActiveFilters(fields = [], state = {}) {
  return fields.filter((field) => isFilterActive(field, state[field.name])).length;
}

export function formatOptionLabel(options = [], value) {
  if (value === '' || value === null || value === undefined) {
    return '';
  }

  const option = options.find((item) => String(item.value) === String(value));
  return option ? option.label : String(value);
}

export function formatChipLabel(field, value) {
  if (!field) {
    return '';
  }

  if (field.type === 'multi' || field.type === 'checkbox') {
    return (value || [])
      .map((item) => formatOptionLabel(field.options || [], item))
      .filter(Boolean)
      .join(', ');
  }

  if (field.type === 'dateRange') {
    if (!value?.from && !value?.to) {
      return '';
    }
    return `${value.from || 'Any'} → ${value.to || 'Any'}`;
  }

  if (field.type === 'range') {
    const min = value?.min ?? '';
    const max = value?.max ?? '';
    if (!min && !max) {
      return '';
    }
    return `${min || 'Min'} to ${max || 'Max'}`;
  }

  if (field.type === 'toggle') {
    return value ? field.label : '';
  }

  if (field.type === 'radio') {
    return formatOptionLabel(field.options || [], value);
  }

  if (field.type === 'select') {
    return formatOptionLabel(field.options || [], value);
  }

  return String(value || '');
}
