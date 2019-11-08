import React from 'react'

const Notification = ({ message, messageType }) => {
  if (message === null) {
    return null
  }

  const notificationStyle = {}
  if (messageType) {
    notificationStyle.color = 'green'
  } else {
    notificationStyle.color = 'red'
  }

  return (
    <div className='notification' style={notificationStyle}>
      {message}
    </div>
  )
}

export default Notification