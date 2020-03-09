import React, { useState } from 'react'

const Authors = (props) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')
  if (props.authors.loading) return <div>loading...</div>
  if (!props.show) {
    return null
  }

  const authors = props.authors.data.allAuthors

  const submit = async (e) => {
    e.preventDefault()
    await props.editAuthor({
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
      {props.token
        ?
          <>
            <h2>Set birth year</h2>
            <form onSubmit={submit}>
              <div>
                  name
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
          </>
        : <></>
      }
    </div>
  )
}

export default Authors