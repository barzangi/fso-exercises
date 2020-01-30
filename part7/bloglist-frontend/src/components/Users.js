import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { initializeUsers } from '../reducers/usersReducer'

const Users = (props) => {

  useEffect(() => {
    props.initializeUsers()
    // eslint-disable-next-line
  }, [])

  if (props.users.length === 0) return null

  return (
    <>
      <h1>Users</h1>
      <table>
        <thead>
          <tr><th /><th><strong>blogs created</strong></th></tr>
        </thead>
        <tbody>
          {props.users.map(user =>
            <tr key={user.id}>
              <td><a href={`http://localhost:3000/users/${user.id}`}>{user.name}</a></td>
              <td>{user.blogs.length}</td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  )
}

const mapStateToProps = (state) => {
  return {
    users: state.users
  }
}

const mapDispatchToProps = {
  initializeUsers
}

export default connect(mapStateToProps, mapDispatchToProps)(Users)