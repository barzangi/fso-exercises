import React from 'react'
import { connect } from 'react-redux'
import { addVote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = (props) => {

  const anecdoteStyle = {
    marginBottom: 8
  }

  const vote = (anecdote) => {
    props.addVote(anecdote)
    props.setNotification(`You voted for "${anecdote.content}"`, 5)
  }

  return (
    <>
      <h2>Anecdotes</h2>
      {props.filteredAnecdotes.map(anecdote =>
        <div key={anecdote.id} style={anecdoteStyle}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes} <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </>
  )
}

const anecdotesToShow = ({ anecdotes, filter }) => {
  return anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(filter.toLowerCase()))
}

const mapStateToProps = (state) => {
  return {
    filteredAnecdotes: anecdotesToShow(state)
  }
}

const mapDispatchToProps = {
  addVote,
  setNotification
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AnecdoteList)