import React from 'react'
import { connect } from 'react-redux'

const Notification = (props) => {

  const notificationStyle = {}
  notificationStyle.color = props.kind ? 'green' : 'red'
  notificationStyle.display = props.message ? '' : 'none'

  return (
    <div className='notification' style={notificationStyle}>
      {props.message}
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    message: state.notification.message,
    kind: state.notification.kind
  }
}

export default connect(
  mapStateToProps
)(Notification)