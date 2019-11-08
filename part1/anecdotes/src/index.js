import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const App = (props) => {

  const [selected, setSelected] = useState(0)
  const [votes, updateVotes] = useState(() => {
    // initialize votes array with zero values
    let votesInit = new Array(anecdotes.length).fill(0)
    return votesInit
  });

  // return random index for anecdotes array
  const randomIndex = () => Math.floor(Math.random() * props.anecdotes.length)

  // update votes array
  const addVote = (currentSelected) => {
    const votesCopy = [...votes]
    votesCopy[currentSelected] += 1
    updateVotes(votesCopy)
  }

  // find index of top voted anecdote
  const findTopAnecdote = () => {
    let max = 0
    let maxIndex = 0
    for (let i = 0; i < votes.length; i++) {
      if (votes[i] > max) {
        maxIndex = i
        max = votes[i]
      }
    }
    return maxIndex
  }

  return (
    <>
      <h1>Anecdote of the day</h1>
      <div>{props.anecdotes[selected]}</div>
      <div>has {votes[selected]} votes</div>
      <button onClick={() => addVote(selected)}>vote</button>
      <button onClick={() => setSelected(randomIndex)}>next anecdote</button>
      <h1>Anecdote with most votes</h1>
      <div>{props.anecdotes[findTopAnecdote()]}</div>
      <div>has {votes[findTopAnecdote()]} votes</div>
    </>
  )
}

const anecdotes = [
  'If it hurts, do it more often.',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(<App anecdotes={anecdotes} />, document.getElementById('root'))