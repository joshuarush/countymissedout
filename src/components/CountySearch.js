import React, { useEffect, useMemo, useState } from 'react';

const CountySearch = ({ counties, onSelect, selectedCounty }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (selectedCounty) {
      setSearchTerm(selectedCounty);
    }
  }, [selectedCounty]);

  const suggestions = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (term.length < 2) return [];
    return counties
      .filter((county) => county.toLowerCase().includes(term))
      .slice(0, 6);
  }, [counties, searchTerm]);

  const handleSelect = (county) => {
    setSearchTerm(county);
    onSelect(county);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && suggestions.length > 0) {
      event.preventDefault();
      handleSelect(suggestions[0]);
    }
  };

  return (
    <div className="search-container" id="lookup">
      <label className="search-label" htmlFor="county-search">
        Find your county
      </label>
      <div className="input-wrapper">
        <input
          id="county-search"
          className="search-input"
          type="text"
          placeholder="Start typing a Texas county"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 120)}
        />
      </div>
      {isFocused && suggestions.length > 0 && (
        <div className="autofill-container">
          {suggestions.map((county) => (
            <button
              key={county}
              className="autofill-option"
              type="button"
              onMouseDown={() => handleSelect(county)}
            >
              {county} County
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CountySearch;
