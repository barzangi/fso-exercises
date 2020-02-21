import React from 'react'
import { gql } from 'apollo-boost'
import { useQuery } from '@apollo/react-hooks'

const ALL_BOOKS = gql`
{
  allBooks {
    title,
    published,
    author {
      name,
      born,
      bookCount,
      id
    },
    genres,
    id
  }
}
`

const Books = (props) => {
  const result = useQuery(ALL_BOOKS)
  if (result.loading) return <div>loading...</div>
  if (!props.show) {
    return null
  }

  const books = result.data.allBooks

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