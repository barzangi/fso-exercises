import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route, Link, withRouter } from 'react-router-dom'
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

// styling
import styled from 'styled-components'

const Page = styled.div`
  padding: 1em;
  background: Beige;
`

const Navigation = styled.div`
  background: Lightblue;
  padding: 1em;
`

const Button = styled.button`
  background: Beige;
  font-size: 1em;
  margin: 0.5em;
  padding: 0.25em, 1em;
  border: 2px, solid, Indigo;
  border-radius: 3px
`

const Input = styled.input`
  margin: 0.25em;
`

const Menu = (props) => {
  const padding = {
    padding: 5
  }
  /*
  const menuContainer = {
    marginBottom: 10,
    padding: 5,
    backgroundColor: '#d9d9d9'
  }
  */
  return (
    <>
      {/*<div style={menuContainer}>*/}
      <Navigation>
        <Link style={padding} to='/'>blogs</Link>
        <Link style={padding} to='/users'>users</Link>
        <span style={padding}>{props.user.name} is logged in <Button onClick={props.handleLogout}>logout</Button></span>
      </Navigation>
      {/*</div>*/}
    </>
  )
}

const SingleBlog = withRouter(Blog)

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
        <Input {...bindUsername} />
      </div>
      <div>
        password:
        <Input {...bindPassword} />
      </div>
      <Button type='submit' primary=''>login</Button>
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
      <Page>
        <Notification />
        {props.user === null ?
          <div>
            <h1>Log in to application</h1>
            {loginForm()}
          </div> :
          <div>
            <Router>
              <div>
                <Menu user={props.user} handleLogout={() => handleLogout()} />
              </div>
              <h1>Blogs App</h1>
              <Route exact path='/' render={() => <Blogs />} />
              <Route exact path='/users' render={() => <Users />} />
              <Route exact path='/users/:id' render={({ match }) =>
                <User user={userById(match.params.id)} />}
              />
              <Route exact path='/blogs/:id' render={({ match }) =>
                <SingleBlog blog={blogById(match.params.id)} />}
              />
            </Router>
          </div>
        }
      </Page>
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