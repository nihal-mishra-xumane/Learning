import { useMemo, useState } from 'react';
import { Filters } from '../../common/Filters';
import './FiltersPage.css';

const departmentOptions = [
  { label: 'Engineering', value: 'engineering' },
  { label: 'Finance', value: 'finance' },
  { label: 'Human Resources', value: 'hr' },
  { label: 'Marketing', value: 'marketing' },
  { label: 'Operations', value: 'operations' },
  { label: 'Product', value: 'product' },
  { label: 'Sales', value: 'sales' },
];

const statusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Pending', value: 'pending' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Archived', value: 'archived' },
];

const priorityOptions = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
  { label: 'Critical', value: 'critical' },
];

const regionOptions = [
  { label: 'North America', value: 'north-america' },
  { label: 'Europe', value: 'europe' },
  { label: 'Asia Pacific', value: 'asia-pacific' },
  { label: 'Latin America', value: 'latin-america' },
];

const filterButtons = [
  { key: 'select', label: 'Select' },
  { key: 'multi', label: 'Multi Select' },
  { key: 'checkbox', label: 'Checkbox' },
  { key: 'radio', label: 'Radio' },
  { key: 'dateRange', label: 'Date Range' },
  { key: 'range', label: 'Range' },
  { key: 'toggle', label: 'Toggle' },
];

const demoValues = {
  select: { department: 'engineering' },
  multi: { status: ['active', 'pending'] },
  checkbox: { categories: ['design', 'analytics'] },
  radio: { priority: 'high' },
  dateRange: { date: { from: '2025-03-01', to: '2025-03-14', invalid: false } },
  range: { price: { min: '1200', max: '8400' } },
  toggle: { activeOnly: true },
  chips: {
    department: 'engineering',
    status: ['active'],
    region: 'europe',
    activeOnly: true,
  },
};

const filterRegistry = {
  select: {
    fields: [
      {
        type: 'select',
        name: 'department',
        label: 'Department',
        placeholder: 'Select department',
        options: departmentOptions,
      },
    ],
  },
  multi: {
    fields: [
      {
        type: 'multi',
        name: 'status',
        label: 'Status',
        options: statusOptions,
      },
    ],
  },
  checkbox: {
    fields: [
      {
        type: 'checkbox',
        name: 'categories',
        label: 'Categories',
        options: [
          { label: 'Design', value: 'design' },
          { label: 'Analytics', value: 'analytics' },
          { label: 'Operations', value: 'operations' },
          { label: 'Support', value: 'support' },
        ],
      },
    ],
  },
  radio: {
    fields: [
      {
        type: 'radio',
        name: 'priority',
        label: 'Priority',
        options: priorityOptions,
      },
    ],
  },
  dateRange: {
    fields: [
      {
        type: 'dateRange',
        name: 'date',
        label: 'Date Range',
      },
    ],
  },
  range: {
    fields: [
      {
        type: 'range',
        name: 'price',
        label: 'Price Range',
        min: 0,
        max: 20000,
        step: 50,
      },
    ],
  },
  toggle: {
    fields: [
      {
        type: 'toggle',
        name: 'activeOnly',
        label: 'Active Only',
        description: 'Only show active records',
      },
    ],
  },
};

export default function FiltersPage() {
  const [activeFilter, setActiveFilter] = useState('select');
  const [filters, setFilters] = useState(demoValues.select);

  const activeFilterCount = useMemo(
    () =>
      Object.values(filters).filter((value) => {
        if (Array.isArray(value)) return value.length > 0;
        if (typeof value === 'object' && value !== null) {
          return Boolean(value.from || value.to || value.min || value.max || value.invalid);
        }
        if (typeof value === 'boolean') return value;
        return Boolean(value);
      }).length,
    [filters]
  );

  const selectedFilter = filterRegistry[activeFilter];

  const handleChange = (nextValue) => {
    setFilters(nextValue);
  };

  const handleApply = (nextFilters) => {
    console.log('Apply filters', nextFilters);
  };

  const handleReset = () => {
    const restored = demoValues[activeFilter] || {};
    setFilters(restored);
  };

  return (
    <div className="filters-demo-page">
      <div className="filters-hero">
        <div>
          <span className="filters-eyebrow">Reusable UI</span>
          <h1>Filter Components</h1>
        </div>
        <button type="button" className="filters-badge">Filters ({activeFilterCount})</button>
      </div>

      <p className="filters-subtitle">Reusable configurable filters for narrowing application data.</p>

      <div className="filter-demo-tabs" role="tablist" aria-label="Filter types">
        {filterButtons.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`filter-demo-tab ${activeFilter === tab.key ? 'active' : ''}`}
            onClick={() => {
              setActiveFilter(tab.key);
              setFilters(demoValues[tab.key] || {});
            }}
            role="tab"
            aria-selected={activeFilter === tab.key}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <section className="filter-demo-preview">
        <div className="filter-preview-topbar">
          <div className="filter-preview-heading-wrap">
            <span className="filter-preview-kicker">LIVE PREVIEW</span>
            <h2>{selectedFilter.fields[0].label}</h2>
          </div>
          <button type="button" className="filter-preview-pill">Component preview</button>
        </div>

        <div className="filter-preview-inline-tag">
          <span className="filter-preview-dot" />
          <span>
            {activeFilter === 'select'
              ? 'Single-select menu with quick filtering and selection cleanup'
              : activeFilter === 'multi'
                ? 'Multi-select list with search, clear all, and count tracking'
                : activeFilter === 'checkbox'
                  ? 'Checklist-based selection for multiple values'
                  : activeFilter === 'radio'
                    ? 'Single-choice control with clear support'
                    : activeFilter === 'dateRange'
                      ? 'Date range selection with validation'
                      : activeFilter === 'range'
                        ? 'Numeric min and max input controls'
                        : 'On/off switch filter for boolean preferences'}
          </span>
        </div>

        <div className="filter-preview-component">
          <Filters
            fields={selectedFilter.fields}
            value={filters}
            onChange={handleChange}
            onApply={handleApply}
            onReset={handleReset}
            title="Filters"
            applyLabel="Apply"
            resetLabel="Reset"
          />
        </div>
      </section>
    </div>
  );
}
