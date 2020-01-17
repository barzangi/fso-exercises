const initialState = {
  message: null,
  kind: false
}

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.data
    default:
      return state
  }
}

export const setNotification = (message, kind, timeout) => {
  return async dispatch => {
    await dispatch({
      type: 'SET_NOTIFICATION',
      data: {
        message,
        kind
      }
    })
    setTimeout(() => {
      dispatch({
        type: 'SET_NOTIFICATION',
        data: {
          message: null,
          kind: false
        }
      })
    }, timeout * 1000)
  }
}

export default notificationReducer