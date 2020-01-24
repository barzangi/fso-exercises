import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import usersService from './services/users'
import Togglable from './components/Togglable'
import { useField } from './hooks'
import { setNotification } from './reducers/notificationReducer'
import { initializeBlogs, createBlog, addLike, destroyBlog } from './reducers/blogReducer'
import { setUser } from './reducers/userReducer'

const Header = (props) => {
  return (
    <>
      <h1>Blogs</h1>
      <p>{props.user.name} is logged in <button onClick={props.handleLogout}>logout</button></p>
    </>
  )
}

const Blogs = (props) => {
  const [blogs, setBlogs] = useState([])
  const { value:newTitle, bind:bindNewTitle, reset:resetNewTitle } = useField('text')
  const { value:newAuthor, bind:bindNewAuthor, reset:resetNewAuthor } = useField('text')
  const { value:newUrl, bind:bindNewUrl, reset:resetNewUrl } = useField('text')

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <div>
        title
        <input {...bindNewTitle} />
      </div>
      <div>
        author
        <input {...bindNewAuthor} />
      </div>
      <div>
        url
        <input {...bindNewUrl} />
      </div>
      <button type='submit'>create</button>
    </form>
  )

  const blogList = () =>
    props.blogs.map(blog =>
      <Blog
        key={blog.id}
        blog={blog}
        addLike={() => like(blog)}
        deleteBlog={() => deleteBlog(blog)}
        loggedInUser={props.user}
      />
    )

  const addBlog = async (event) => {
    event.preventDefault()
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl
    }
    try {
      const newBlog = await props.createBlog(blogObject, props.user)
      setBlogs(blogs.concat(newBlog))
      props.setNotification(`New blog "${newTitle}" by ${newAuthor} added`, true, 5)
    } catch (error) {
      props.setNotification('an error occured', false, 5)
    }
    resetNewTitle()
    resetNewAuthor()
    resetNewUrl()
  }

  const like = (blog) => {
    props.addLike(blog)
  }

  const deleteBlog = async (blog) => {
    const deleteConfirm = window.confirm(`Remove blog post "${blog.title}" by ${blog.author}?`)
    if (deleteConfirm) {
      try {
        const idToRemove = blog.id
        await props.destroyBlog(idToRemove)
        console.log('blog.id:', idToRemove)
        setBlogs(blogs.filter(b => b.id !== idToRemove))
        props.setNotification(`Removed blog post "${blog.title}" by ${blog.author}`, true, 5)
      } catch (error) {
        console.log('error:', error)
        props.setNotification('an error occured', false, 5)
      }
    }
  }

  return (
    <>
      <Togglable buttonLabel='new blog'>
        <h1>Create new</h1>
        {blogForm()}
      </Togglable>
      {blogList()}
    </>
  )

}

const Users = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    const getUsers = async () => {
      const users = await usersService.getAll()
      setUsers(users)
    }
    getUsers()
  }, [])

  console.log('users:', users)

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

const App = (props) => {
  const { value:username, bind:bindUsername, reset:resetUsername } = useField('text')
  const { value:password, bind:bindPassword, reset:resetPassword } = useField('password')

  useEffect(() => {
    props.initializeBlogs()
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
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
      blogService.setToken(user.token)
      props.setUser(user)
      resetUsername()
      resetPassword()
    } catch(exception) {
      props.setNotification('Wrong username or password', false, 5)
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
                blogs={props.blogs}
                user={props.user}
                createBlog={props.createBlog}
                addLike={props.addLike}
                destroyBlog={props.destroyBlog}
                setNotification={props.setNotification}
                handleLogout={() => handleLogout()}
              />
            } />
            <Route exact path='/users' render={() => <Users />} />
          </Router>
        </div>
      }
    </>
  )
}

const mapStateToProps = (state) => {
  return {
    blogs: state.blogs,
    user: state.user
  }
}

const mapDispatchToProps = {
  setNotification,
  initializeBlogs,
  createBlog,
  addLike,
  destroyBlog,
  setUser
}

export default connect(mapStateToProps, mapDispatchToProps)(App)