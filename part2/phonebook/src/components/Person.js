import React from 'react'

const Person = ({ person, filterText, destroyPersonFunction }) =>
  person.name.toLowerCase().includes(filterText.toLowerCase()) ?
  <div>{person.name} {person.number} <button onClick={destroyPersonFunction}>delete</button></div> : ''

export default Person