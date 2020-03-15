import React from 'react'

const Recommended = (props) => {
  if (props.books.loading) return <div>loading...</div>
  if (!props.show) {
    return null
  }

  const books = props.books.data.allBooks

  const favGenre = props.user.data.me.favoriteGenre

  const recommendedBooks = books.filter(b => b.genres.includes(favGenre))

  const cellStyle = {
    padding: 5,
    textAlign: 'left'
  }

  return (
    <div>
      <h2>recommendations</h2>
      <div>books in your favourite genre <strong>{favGenre}</strong></div>
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
          {recommendedBooks.map(b =>
            <tr key={b.id}>
              <td style={cellStyle}>{b.title}</td>
              <td style={cellStyle}>{b.author.name}</td>
              <td style={cellStyle}>{b.published}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Recommended