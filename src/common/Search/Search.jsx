import React from 'react';
import './Search.css';
import TextSearch from './components/TextSearch';
import MultiSearch from './components/MultiSearch';
import AutocompleteSearch from './components/AutocompleteSearch';
import DropdownSearch from './components/DropdownSearch';

export function Search({ type = 'text', ...props }) {
  switch (type) {
    case 'multi':
      return <MultiSearch {...props} />;
    case 'autocomplete':
      return <AutocompleteSearch {...props} />;
    case 'dropdown':
      return <DropdownSearch {...props} />;
    case 'text':
    default:
      return <TextSearch {...props} />;
  }
}

export default Search;
