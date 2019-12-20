import React, { useState, useEffect } from 'react'
import axios from 'axios'


const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => setValue(event.target.value)

  const reset = () => setValue('')

  return {
    value,
    reset,
    bind: {
      value,
      type,
      onChange
    }
  }
}

const useResource = (baseUrl) => {
  const [resources, setResources] = useState([])

  const getAll = () => {
    axios
      .get(baseUrl)
      .then(response => setResources(response.data))
  }

  const create = resource => {
    axios
      .post(baseUrl, resource)
      .then(response => setResources(resources.concat(response.data)))
  }

  const service = {
    getAll, create
  }

  return [
    resources, service
  ]
}

const App = () => {
  const { value:content, bind:bindContent, reset:resetContent } = useField('text')
  const { value:name, bind:bindName, reset:resetName } = useField('text')
  const { value:number, bind:bindNumber, reset:resetNumber } = useField('text')

  const [notes, noteService] = useResource('http://localhost:3005/notes')
  const [persons, personService] = useResource('http://localhost:3005/persons')

  useEffect(() => {
    noteService.getAll()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    personService.getAll()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleNoteSubmit = (event) => {
    event.preventDefault()
    noteService.create({ content: content })
    resetContent()
  }
 
  const handlePersonSubmit = (event) => {
    event.preventDefault()
    personService.create({ name: name, number: number })
    resetName()
    resetNumber()
  }

  return (
    <div>
      <h2>notes</h2>
      <form onSubmit={handleNoteSubmit}>
        <input {...bindContent} />
        <button>create</button>
      </form>
      {notes.map(n => <p key={n.id}>{n.content}</p>)}

      <h2>persons</h2>
      <form onSubmit={handlePersonSubmit}>
        name <input {...bindName} /> <br/>
        number <input {...bindNumber} />
        <button>create</button>
      </form>
      {persons.map(n => <p key={n.id}>{n.name} {n.number}</p>)}
    </div>
  )
}

export default App