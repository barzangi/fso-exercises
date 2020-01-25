import React, { useState, useEffect } from 'react'
import usersService from '../services/users'

const Users = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    const getUsers = async () => {
      const users = await usersService.getAll()
      setUsers(users)
    }
    getUsers()
  }, [])

  if (users.length === 0) return null

  return (
    <>
      <h1>Users</h1>
      <table>
        <thead>
          <tr><th /><th><strong>blogs created</strong></th></tr>
        </thead>
        <tbody>
          {users.map(user =>
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.blogs.length}</td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  )
}

export default Users