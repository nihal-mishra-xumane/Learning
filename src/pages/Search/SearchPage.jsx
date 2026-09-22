import { useEffect, useMemo, useState } from 'react';
import { Search } from '../../common/Search';
import './SearchPage.css';

const demoOptions = [
  { label: 'Engineering', value: 'engineering' },
  { label: 'Finance', value: 'finance' },
  { label: 'Human Resources', value: 'hr' },
  { label: 'Marketing', value: 'marketing' },
  { label: 'Operations', value: 'operations' },
  { label: 'Product', value: 'product' },
  { label: 'Sales', value: 'sales' },
];

const allAutocompleteSuggestions = [
  'Ava Patel',
  'Daniel Nguyen',
  'Emily Brooks',
  'Jacob Moore',
  'Maya Johnson',
  'Olivia Chen',
  'Samuel White',
  'Sophia Garcia',
  'Priya Sharma',
  'Leo Martin',
  'Nora Wilson',
  'Chris Evans',
  'Emma Robinson',
  'Noah Taylor',
  'Hannah Lewis',
  'Michael Walker'
];

const textExamples = [
  'Ava Patel',
  'Daniel Nguyen',
  'Emily Brooks',
  'Jacob Moore',
  'Maya Johnson',
  'Olivia Chen',
  'Samuel White',
  'Sophia Garcia',
  'Priya Sharma',
  'Leo Martin',
  'Nora Wilson',
  'Chris Evans',
];

export default function SearchPage() {
  const [activeType, setActiveType] = useState('text');
  const [textValue, setTextValue] = useState('');
  const [multiValue, setMultiValue] = useState(['engineering', 'sales']);
  const [autocompleteValue, setAutocompleteValue] = useState('');
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState(allAutocompleteSuggestions.slice(0, 8));
  const [dropdownValue, setDropdownValue] = useState('engineering');
  const [textLoading, setTextLoading] = useState(false);

  const autocompleteExamples = allAutocompleteSuggestions.slice(0, 6);

  useEffect(() => {
    const query = autocompleteValue.trim();

    const timer = setTimeout(() => {
      if (!query) {
        setAutocompleteSuggestions(allAutocompleteSuggestions.slice(0, 8));
        return;
      }

      const filtered = allAutocompleteSuggestions.filter((name) =>
        name.toLowerCase().includes(query.toLowerCase())
      );

      setAutocompleteSuggestions(filtered);
    }, 350);

    return () => clearTimeout(timer);
  }, [autocompleteValue]);

  const handleTextSearch = (value) => {
    setTextLoading(true);
    window.setTimeout(() => {
      setTextLoading(false);
    }, 500);
    setTextValue(value);
  };

  const filteredTextResults = textValue.trim()
    ? textExamples.filter((item) => item.toLowerCase().includes(textValue.toLowerCase()))
    : textExamples.slice(0, 6);

  const noResultsText = textValue.trim().length > 0 ? 'No users match your search.' : 'Start typing to search.';

  const renderSelectedType = () => {
    switch (activeType) {
      case 'multi':
        return (
          <Search
            type="multi"
            label="Departments"
            options={demoOptions}
            value={multiValue}
            onChange={setMultiValue}
            placeholder="Search departments..."
          />
        );
      case 'autocomplete':
        return (
          <>
            <div className="autocomplete-example-list" aria-label="Autocomplete examples">
              {autocompleteExamples.map((item) => (
                <button
                  key={item}
                  type="button"
                  className="autocomplete-example-pill"
                  onClick={() => setAutocompleteValue(item)}
                >
                  {item}
                </button>
              ))}
            </div>

            <Search
              type="autocomplete"
              placeholder="Search customers..."
              suggestions={autocompleteSuggestions}
              value={autocompleteValue}
              onChange={setAutocompleteValue}
              onSearch={(value) => console.log('Autocomplete search:', value)}
              onSuggestionSelect={(value) => console.log('Selected suggestion:', value)}
              loading={false}
            />
          </>
        );
      case 'dropdown':
        return (
          <Search
            type="dropdown"
            options={demoOptions}
            value={dropdownValue}
            onChange={setDropdownValue}
            placeholder="Select department"
          />
        );
      case 'text':
      default:
        return (
          <>
            <Search
              type="text"
              value={textValue}
              placeholder="Search users..."
              onChange={setTextValue}
              onSearch={handleTextSearch}
              debounceMs={300}
              loading={textLoading}
              noResults={textValue.trim().length > 0 && !textLoading && filteredTextResults.length === 0}
              emptyMessage={noResultsText}
            />

            {textValue.trim() || filteredTextResults.length > 0 ? (
              <div className="search-example-results" aria-live="polite">
                {filteredTextResults.length === 0 ? (
                  <div className="search-example-empty">{noResultsText}</div>
                ) : (
                  filteredTextResults.map((item) => (
                    <div key={item} className="search-example-result">
                      {item}
                    </div>
                  ))
                )}
              </div>
            ) : null}
          </>
        );
    }
  };

  return (
    <div className="search-demo-page">
      <div className="search-demo-tabs" role="tablist" aria-label="Search components">
        {['text', 'multi', 'autocomplete', 'dropdown'].map((type) => (
          <button
            key={type}
            type="button"
            className={`search-demo-tab ${activeType === type ? 'active' : ''}`}
            onClick={() => setActiveType(type)}
            aria-selected={activeType === type}
            role="tab"
          >
            {type === 'text' ? 'Text' : type === 'multi' ? 'Multi Select' : type === 'autocomplete' ? 'Autocomplete' : 'Dropdown'}
          </button>
        ))}
      </div>

      <section className="search-demo-preview">
        <div className="search-preview-topbar">
          <div className="search-preview-heading-wrap">
            <span className="search-preview-kicker">LIVE PREVIEW</span>
            <h2>{activeType === 'text' ? 'Text Search' : activeType === 'multi' ? 'Multi Search' : activeType === 'autocomplete' ? 'Autocomplete Search' : 'Dropdown Search'}</h2>
          </div>
          <button type="button" className="search-preview-pill">Component preview</button>
        </div>

        <div className="search-preview-inline-tag">
          <span className="search-preview-dot" />
          <span>
            {activeType === 'dropdown'
              ? 'Searchable single-select menu with quick filtering'
              : activeType === 'multi'
                ? 'Multi-select panel with quick filtering and bulk actions'
                : activeType === 'autocomplete'
                  ? 'Search suggestions with keyboard navigation and quick picks'
                  : 'Search input with instant filtering and clear actions'}
          </span>
        </div>

        <div className="search-preview-component">
          {activeType === 'dropdown' && (
            <>
              <div className="search-preview-label">DEPARTMENT</div>
              {renderSelectedType()}
            </>
          )}

          {activeType !== 'dropdown' && renderSelectedType()}
        </div>
      </section>

      <section className="search-demo-states">
        <div className="search-states-header">
          <div className="search-states-title-wrap">
            <span className="search-states-label">STATES</span>
            <h3>Component states</h3>
          </div>
          <button type="button" className="search-preview-pill">Interaction feedback</button>
        </div>

        <div className="search-state-grid">
          <div className="search-state-card">
            <h4>DEFAULT</h4>
            <p>Ready for input</p>
            <Search type="text" placeholder="Search users..." />
          </div>
          <div className="search-state-card">
            <h4>LOADING</h4>
            <p>Searching results</p>
            <Search type="text" placeholder="Search..." loading />
          </div>
          <div className="search-state-card">
            <h4>NO RESULTS</h4>
            <p>No matching records</p>
            <Search type="text" placeholder="Search..." value="abc" noResults emptyMessage="No results found." />
          </div>
        </div>
      </section>
    </div>
  );
}
