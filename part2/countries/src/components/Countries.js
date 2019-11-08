import React from 'react'
import CountryList from './CountryList'
import SingleCountry from './SingleCountry'

const Countries = ({ countries, filterText, handlerFunction }) => {
  const listOfCountries = countries.filter(country => country.name.toLowerCase().includes(filterText.toLowerCase()))

  if (!filterText) {
    return (
      <div>please type text in the box above</div>
    )
  } else if (listOfCountries.length > 10) {
    return (
      <div>too many matches, try adjusting your filter</div>
    )
  } else if (listOfCountries.length > 1) {
    return (
      listOfCountries.map(country => <CountryList key={country.alpha3Code} country={country} handlerFunction={handlerFunction} />)
    )
  } else if (listOfCountries.length === 1) {
    return (
      <SingleCountry country={listOfCountries[0]} />
    )
  } else {
    return <div>no matches found</div>
  }
}

export default Countries