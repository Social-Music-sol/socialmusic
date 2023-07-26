import React, { useState } from 'react';

const SearchBar = () => {
  const [search, setSearch] = useState('');

  const handleInputChange = (event) => {
    setSearch(event.target.value);
  }

  return (
    <input type="text" placeholder="Search..." value={search} onChange={handleInputChange} />
  );
}

export default SearchBar;
