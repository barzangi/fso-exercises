import React from 'react'
import { connect } from 'react-redux'
import { setNotification } from '../reducers/notificationReducer'
import { addLike, destroyBlog } from '../reducers/blogReducer'

// import PropTypes from 'prop-types'

const Blog = (props) => {
  if (props.blog === undefined) return null

  const removeButtonStyle = { display: props.blog.user.username === props.user.username ? '' : 'none' }

  const like = (blog) => {
    props.addLike(blog)
  }

  const deleteBlog = async (blog) => {
    const deleteConfirm = window.confirm(`Remove blog post "${blog.title}" by ${blog.author}?`)
    if (deleteConfirm) {
      try {
        await props.destroyBlog(blog.id)
        props.history.push('/')
        props.setNotification(`Removed blog post "${blog.title}" by ${blog.author}`, true, 3)
      } catch (error) {
        console.log('error:', error)
        props.setNotification('an error occured', false, 5)
      }
    }
  }

  return (
    <>
      <h1>{props.blog.title} - {props.blog.author}</h1>
      <div><a href={props.blog.url}>{props.blog.url}</a></div>
      <div>{props.blog.likes} likes <button type='text' onClick={() => like(props.blog)}>like</button></div>
      <div>Added by {props.blog.user.name}</div>
      <div><button type='text' onClick={() => deleteBlog(props.blog)} style={removeButtonStyle}>remove</button></div>
    </>
  )
}

/*
Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  addLike: PropTypes.func.isRequired,
  destroyBlog: PropTypes.func.isRequired,
  loggedInUser: PropTypes.object.isRequired
}
*/

const mapStateToProps = (state) => {
  return {
    blogs: state.blogs,
    user: state.user
  }
}

const mapDispatchToProps = {
  setNotification,
  addLike,
  destroyBlog
}

export default connect(mapStateToProps, mapDispatchToProps)(Blog)