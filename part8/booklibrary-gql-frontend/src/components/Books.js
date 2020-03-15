import React, { useState } from 'react'

const Books = (props) => {
  const [genre, setGenre] = useState(null)
  if (props.books.loading) return <div>loading...</div>
  if (!props.show) {
    return null
  }

  const books = props.books.data.allBooks

  const uniqueGenres = [ ...new Set(books.map(b => b.genres.map(g => g)).flat())]

  const filteredBooks = genre ? books.filter(b => b.genres.includes(genre)) : books

  const cellStyle = {
    padding: 5,
    textAlign: 'left'
  }

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th style={cellStyle}>
              title
            </th>
            <th style={cellStyle}>
              author
            </th>
            <th style={cellStyle}>
              published
            </th>
          </tr>
          {filteredBooks.map(b =>
            <tr key={b.id}>
              <td style={cellStyle}>{b.title}</td>
              <td style={cellStyle}>{b.author.name}</td>
              <td style={cellStyle}>{b.published}</td>
            </tr>
          )}
        </tbody>
      </table>
      <h3>filter by genre</h3>
      {uniqueGenres.map(genre =>
        <button
          key={genre}
          onClick={() => setGenre(genre)}
        >{genre}</button>
      )}
      <button onClick={() => setGenre(null)}>all genres</button>
    </div>
  )
}

export default Books