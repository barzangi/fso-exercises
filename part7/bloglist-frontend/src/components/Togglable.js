import React, { useState } from 'react'

// styling
import styled from 'styled-components'

const Button = styled.button`
  background: Beige;
  font-size: 1em;
  margin: 0.25em;
  padding: 0.25em, 1em;
  border: 2px, solid, Indigo;
  border-radius: 3px
`

const Togglable = (props) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <>
      <div style={hideWhenVisible}>
        <Button onClick={toggleVisibility}>{props.buttonLabel}</Button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <Button onClick={toggleVisibility}>cancel</Button>
      </div>
    </>
  )
}

export default Togglable