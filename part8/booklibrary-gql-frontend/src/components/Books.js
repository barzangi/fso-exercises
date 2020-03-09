import React from 'react'

const Books = (props) => {
  if (props.books.loading) return <div>loading...</div>
  if (!props.show) {
    return null
  }

  const books = props.books.data.allBooks

  const padding={ padding: 5 }

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th style={padding}></th>
            <th style={padding}>
              author
            </th>
            <th style={padding}>
              published
            </th>
          </tr>
          {books.map(a =>
            <tr key={a.id}>
              <td style={padding}>{a.title}</td>
              <td style={padding}>{a.author.name}</td>
              <td style={padding}>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Books