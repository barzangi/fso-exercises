import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Togglable from './Togglable'
import { useField } from '../hooks'
import { setNotification } from '../reducers/notificationReducer'
import { createBlog } from '../reducers/blogReducer'

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

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 5,
    paddingBottom: 10,
    border: 'solid',
    borderWidth: 1,
    marginTop: 5
  }

  const blogList = () =>
    props.blogs.map(blog =>
      <div style={blogStyle} key={blog.id}>
        <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
      </div>
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
}

export default connect(mapStateToProps, mapDispatchToProps)(Blogs)