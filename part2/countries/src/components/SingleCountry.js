import React from 'react'

const SingleCountry = ({ country }) => {
  return (
    <>
      <h2>{country.name}</h2>
      <div><strong>Capital:</strong> {country.capital}</div>
      <div><strong>Population:</strong> {country.population}</div>
      <h3>Languages</h3>
      <ul>
        {country.languages.map(language => <li key={language.iso639_2}>{language.name}</li>)}
      </ul>
      <img src={country.flag} alt={country.name} width='150px'></img>
    </>
  )
}

export default SingleCountry