import React, { useState, useEffect } from 'react'
import Person from './components/Person'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import Notification from './components/Notification'
import personService from './services/persons'

const App = () => {
  const [ persons, setPersons ] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ filterText, setFilterText ] = useState('')
  const [ notificationMessage, setNotificationMessage ] = useState(null)
  const [ messageType, setMessageType ] = useState(true)

  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.some(person => person.name.toLowerCase() === newName.toLowerCase())) {
      updatePerson(newName, newNumber)
      // alert(`${newName} is already added to phonebook`);
    } else {
      const personObject = {
        name: newName,
        number: newNumber
      }
      personService
        .create(personObject)
        .then(response => {
          console.log('response', response.data)
          setPersons(persons.concat(response.data))
          setNotificationMessage(`Added ${newName}`)
          setMessageType(true)
        })
        .catch(error => {
          // console.log(error.response.data.error);
          setNotificationMessage(error.response.data.error)
          setMessageType(false)
        })
        setTimeout(() => {
          setNotificationMessage(null)
        }, 5000)
    }
    setNewName('')
    setNewNumber('')
  }

  const updatePerson = (newName, newNumber) => {
    const updateConfirm = window.confirm(`${newName} is already added to the phonebook, replace old number with a new one?`)
    if (updateConfirm) {
      const updatedPersonId = persons.filter(person => person.name.toLowerCase() === newName.toLowerCase())[0].id
      const updatedPersonObject = {
        name: newName,
        number: newNumber
      }
      personService
        .update(updatedPersonId, updatedPersonObject)
        .then(response => {
          setPersons(persons.map(p => p.id !== updatedPersonId ? p : response.data))
          setNotificationMessage(`Updated ${newName} with new number ${newNumber}`)
          setMessageType(true)
        })
        .catch(error => {
          setNotificationMessage(`Information of ${newName} has already been removed from server`)
          setMessageType(false)
          setPersons(persons.filter(p => p.id !== updatedPersonId))
        })
      setTimeout(() => { setNotificationMessage(null); }, 5000)
    }
    setNewName('')
    setNewNumber('')
  }

  const destroyPerson = person => {
    const destroyConfirm = window.confirm(`Delete ${person.name}?`)
    if (destroyConfirm) {
      personService
        .destroy(person.id)
        .then(response => {
          setPersons(persons.filter(p => p.id !== person.id))
          setNotificationMessage(`Deleted ${person.name}`)
          setMessageType(true)
        })
        .catch(error => {
          setNotificationMessage(`Information of ${person.name} has already been removed from server`)
          setMessageType(false)
          setPersons(persons.filter(p => p.id !== person.id))
        })
      setTimeout(() => { setNotificationMessage(null); }, 5000)
    }
  }
  
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterTextChange = (event) => {
    setFilterText(event.target.value)
  }

  const Persons = () => persons.map(person =>
    <Person
      key={person.id}
      person={person}
      filterText={filterText}
      destroyPersonFunction={() => destroyPerson(person)}
    />
  )

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={notificationMessage} messageType={messageType} />

      <Filter filterText={filterText} handlerFunction={handleFilterTextChange} />
      <h2>add a new</h2>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons />
    </div>
  )
}

export default App