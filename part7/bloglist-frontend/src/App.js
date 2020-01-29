import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Blogs from './components/Blogs'
import Users from './components/Users'
import User from './components/User'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import { useField } from './hooks'
import { setNotification } from './reducers/notificationReducer'
import { initializeBlogs } from './reducers/blogReducer'
import { initializeUsers } from './reducers/usersReducer'
import { setUser } from './reducers/userReducer'

const Header = (props) => {
  return (
    <>
      <h1>Blogs</h1>
      <p>{props.user.name} is logged in <button onClick={props.handleLogout}>logout</button></p>
    </>
  )
}

const App = (props) => {
  const { value:username, bind:bindUsername, reset:resetUsername } = useField('text')
  const { value:password, bind:bindPassword, reset:resetPassword } = useField('password')

  useEffect(() => {
    props.initializeBlogs()
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    props.initializeUsers()
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      props.setUser(user)
    }
    // eslint-disable-next-line
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      props.setUser(user)
      resetUsername()
      resetPassword()
    } catch(exception) {
      props.setNotification('Wrong username or password', false, 3)
    }
  }

  const handleLogout = () => {
    window.localStorage.clear()
    props.setUser(null)
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username:
        <input {...bindUsername} />
      </div>
      <div>
        password:
        <input {...bindPassword} />
      </div>
      <button type='submit'>login</button>
    </form>
  )

  const userById = (id) => {
    return props.users.find(u => u.id === id)
  }

  const blogById = (id) => {
    return props.blogs.find(b => b.id === id)
  }


  return (
    <>
      <Notification />
      {props.user === null ?
        <div>
          <h1>Log in to application</h1>
          {loginForm()}
        </div> :
        <div>
          <Header user={props.user} handleLogout={() => handleLogout()} />
          <Router>
            <Route exact path='/' render={() =>
              <Blogs
                user={props.user}
                handleLogout={() => handleLogout()}
              />
            } />
            <Route exact path='/users' render={() => <Users />} />
            <Route exact path='/users/:id' render={({ match }) =>
              <User user={userById(match.params.id)} />}
            />
            <Route exact path='/blogs/:id' render={({ match }) =>
              <Blog blog={blogById(match.params.id)} />}
            />
          </Router>
        </div>
      }
    </>
  )
}

const mapStateToProps = (state) => {
  return {
    blogs: state.blogs,
    user: state.user,
    users: state.users
  }
}

const mapDispatchToProps = {
  setNotification,
  initializeBlogs,
  initializeUsers,
  setUser
}

export default connect(mapStateToProps, mapDispatchToProps)(App)