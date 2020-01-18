import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import { useField } from './hooks'
import { setNotification } from './reducers/notificationReducer'
import { initializeBlogs, addLike } from './reducers/blogReducer'

const App = (props) => {
  const [blogs, setBlogs] = useState([])
  // const [username, setUsername] = useState('')
  // const [password, setPassword] = useState('')
  // const [newTitle, setNewTitle] = useState('')
  // const [newAuthor, setNewAuthor] = useState('')
  // const [newUrl, setNewUrl] = useState('')
  const { value:newTitle, bind:bindNewTitle, reset:resetNewTitle } = useField('text')
  const { value:newAuthor, bind:bindNewAuthor, reset:resetNewAuthor } = useField('text')
  const { value:newUrl, bind:bindNewUrl, reset:resetNewUrl } = useField('text')
  const { value:username, bind:bindUsername, reset:resetUsername } = useField('text')
  const { value:password, bind:bindPassword, reset:resetPassword } = useField('password')
  const [user, setUser] = useState(null)

  useEffect(() => {
    props.initializeBlogs()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
    }
  }, [])

  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl
    }

    blogService
      .create(blogObject)
      .then(returnedBlog => {
        returnedBlog = {
          ...returnedBlog,
          user: {
            username: user.username,
            name: user.name,
            id: returnedBlog.user
          }
        }
        setBlogs(blogs.concat(returnedBlog))
        props.setNotification(`New blog "${newTitle}" by ${newAuthor} added`, true, 5)
        // setNotificationMessage(`New blog "${newTitle}" by ${newAuthor} added`)
        // setMessageType(true)
      })
      .catch(error => {
        props.setNotification(error.response.data.error, false, 5)
        // setNotificationMessage(error.response.data.error)
        // setMessageType(false)
      })
      /*
      setTimeout(() => {
      setNotificationMessage(null)
    }, 5000)
    */
    resetNewTitle()
    resetNewAuthor()
    resetNewUrl()
    // setNewTitle('')
    // setNewAuthor('')
    // setNewUrl('')
  }

  /*
  const addLike = id => {
    const blog = blogs.find(b => b.id === id)
    const changedBlog = { ...blog, likes: blog.likes + 1 }

    blogService
      .update(id, changedBlog)
      .then(() => {
        setBlogs(blogs.map(blog => blog.id !== id ? blog : changedBlog).sort((a, b) => b.likes - a.likes))
      })
  }
  */

  const like = (blog) => {
    props.addLike(blog)
  }

  const destroyBlog = blog => {
    const destroyConfirm = window.confirm(`Remove blog post "${blog.title}" by ${blog.author}?`)
    if (destroyConfirm) {
      blogService
        .destroy(blog.id)
        .then(() => {
          setBlogs(blogs.filter(b => b.id !== blog.id))
          props.setNotification(`Removed blog post "${blog.title}" by ${blog.author}`, true, 5)
          // setNotificationMessage(`Removed blog post "${blog.title}" by ${blog.author}`)
          // setMessageType(true)
        })
        .catch(error => {
          props.setNotification(error.response.data.error, false, 5)
          // setNotificationMessage(error.response.data.error)
          // setMessageType(false)
        })
      /*
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
      */
    }
  }

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
      setUser(user)
      setBlogs(blogs.sort((a, b) => b.likes - a.likes))
      resetUsername()
      resetPassword()
      // setUsername('')
      // setPassword('')
    } catch(exception) {
      props.setNotification('Wrong username or password', false, 5)
      // setNotificationMessage('Wrong username or password')
      // setMessageType(false)
      /*
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
      */
    }
  }

  const handleLogout = () => {
    window.localStorage.clear()
    setUser(null)
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

  const BlogList = () => {
    return (
      <>
        {props.blogs.map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            addLike={() => like(blog)}
            destroyBlog={() => destroyBlog(blog)}
            loggedInUser={user}
          />
        )}
      </>
    )
  }

  return (
    <>
      <Notification />
      {user === null ?
        <div>
          <h1>Log in to application</h1>
          {loginForm()}
        </div> :
        <div>
          <h1>Blogs</h1>
          <p>{user.name} is logged in <button onClick={() => handleLogout()}>logout</button></p>
          <Togglable buttonLabel='new blog'>
            <h1>Create new</h1>
            {blogForm()}
          </Togglable>
          {/*{rows()}*/}
          <BlogList />
        </div>
      }
    </>
  )
}

const mapStateToProps = (state) => {
  return {
    blogs: state.blogs
  }
}

const mapDispatchToProps = {
  setNotification,
  initializeBlogs,
  addLike
}

export default connect(mapStateToProps, mapDispatchToProps)(App)