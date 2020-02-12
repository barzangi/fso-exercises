import React from 'react'
import { gql } from 'apollo-boost'
import { useQuery } from '@apollo/react-hooks'

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

const Authors = (props) => {  
  const result = useQuery(ALL_AUTHORS)
  if (result.loading) return <div>loading</div>
  if (!props.show) {
    return null
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
          {result.data.allAuthors.map(a =>
            <tr key={a.name}>
              <td style={padding}>{a.name}</td>
              <td style={padding}>{a.born}</td>
              <td style={padding}>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>

    </div>
  )
}

export default Authors