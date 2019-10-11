import React from 'react';

const CountryList = ({ country, handlerFunction }) => {
  const countryObject = {
    target: {
      value: country.name
    }
  }
  return <div>{country.name} <button onClick={() => handlerFunction(countryObject)}>show</button></div>;
}

export default CountryList;