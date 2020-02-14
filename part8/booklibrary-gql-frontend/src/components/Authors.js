import React, { useState } from 'react'
import { gql } from 'apollo-boost'
import { useQuery, useMutation } from '@apollo/react-hooks'

const ALL_AUTHORS = gql`
{
  allAuthors {
    name,
    born,
    bookCount,
    id
  }
}
`

const EDIT_AUTHOR = gql`
  mutation editAuthor($name: String!, $born: String!) {
    editAuthor(
      name: $name,
      born: $born
    ) {
      name
      born
      bookCount
      id
    }
  }
`

const Authors = (props) => {  
  const result = useQuery(ALL_AUTHORS)
  const [editAuthor] = useMutation(EDIT_AUTHOR)
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')
  if (result.loading) return <div>loading</div>
  if (!props.show) {
    return null
  }

  const authors = result.data.allAuthors

  const submit = async (e) => {
    e.preventDefault()
    await editAuthor({
      variables: { name, born }
    })
    setName('')
    setBorn('')
  }

  const padding={ padding: 5 }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th style={padding}></th>
            <th style={padding}>
              born
            </th>
            <th style={padding}>
              books
            </th>
          </tr>
          {authors.map(a =>
            <tr key={a.id}>
              <td style={padding}>{a.name}</td>
              <td style={padding}>{a.born}</td>
              <td style={padding}>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>
      <h2>Set birth year</h2>
      <form onSubmit={submit}>
        <div>
            name
            {/*
            <input
              value={name}
              onChange={({ target }) => setName(target.value)}
            />
            */}
            <select value={name} onChange={({ target }) => setName(target.value)}>
              {authors.map(a =>
                <option key={a.id} value={a.name}>{a.name}</option>
              )}
            </select>
        </div>
        <div>
            born
            <input
              value={born}
              onChange={({ target }) => setBorn(target.value)}
            />
        </div>
        <button type='submit'>edit author</button>
      </form>
    </div>
  )
}

export default Authors