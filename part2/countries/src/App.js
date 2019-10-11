import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Countries from './components/Countries';
import Filter from './components/Filter';

const App = () => {
  const [ countries, setCountries ] = useState([]);
  const [ filterText, setFilterText ] = useState('');

  useEffect(() => {
    axios
    .get('https://restcountries.eu/rest/v2/all')
    .then(response => {
      setCountries(response.data);
    });
  }, []);

  const handleFilterTextChange = (event) => {
    setFilterText(event.target.value);
  }

  return (
    <>
      <Filter filterText={filterText} handlerFunction={handleFilterTextChange} />
      <Countries countries={countries} filterText={filterText} handlerFunction={handleFilterTextChange} />
    </>
  );
}

export default App;