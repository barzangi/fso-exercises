import React from 'react'
import { connect } from 'react-redux'
import Blog from './Blog'
import Togglable from './Togglable'
import { useField } from '../hooks'
import { setNotification } from '../reducers/notificationReducer'
import { createBlog, addLike, destroyBlog } from '../reducers/blogReducer'

const Blogs = (props) => {
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
      await props.createBlog(blogObject, props.user)
      props.setNotification(`New blog "${newTitle}" by ${newAuthor} added`, true, 3)
    } catch (error) {
      console.log('error:', error)
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
        await props.destroyBlog(blog.id)
        props.setNotification(`Removed blog post "${blog.title}" by ${blog.author}`, true, 3)
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

const mapStateToProps = (state) => {
  return {
    blogs: state.blogs,
    user: state.user
  }
}

const mapDispatchToProps = {
  setNotification,
  createBlog,
  addLike,
  destroyBlog
}

export default connect(mapStateToProps, mapDispatchToProps)(Blogs)