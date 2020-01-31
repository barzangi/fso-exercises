import React from 'react'
import { connect } from 'react-redux'
import { setNotification } from '../reducers/notificationReducer'
import { addLike, destroyBlog, addComment } from '../reducers/blogReducer'
import { useField } from '../hooks'

// import PropTypes from 'prop-types'

const Blog = (props) => {
  const { value:newComment, bind:bindNewComment, reset:resetNewComment } = useField('text')
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
        props.setNotification('an error occured', false, 3)
      }
    }
  }

  const addComment = async (event) => {
    event.preventDefault()
    if (newComment) {
      const blog = props.blog
      if (!blog.comments) blog.comments = []
      props.addComment(blog, newComment)
      resetNewComment()
    } else {
      props.setNotification('Comment cannot be empty', false, 3)
    }
  }

  const commentForm = () => (
    <form onSubmit={addComment}>
      <input {...bindNewComment} /> <button type='submit'>add comment</button>
    </form>
  )

  const displayComments = (blog) => {
    return (
      <>
        <ul>
          {blog.comments.map(c =>
            <li key={c}>{c}</li>
          )}
        </ul>
      </>
    )
  }

  return (
    <>
      <h1>{props.blog.title} - {props.blog.author}</h1>
      <div><a href={props.blog.url}>{props.blog.url}</a></div>
      <div>{props.blog.likes} likes <button type='text' onClick={() => like(props.blog)}>like</button></div>
      <div>Added by {props.blog.user.name}</div>
      <div><button type='text' onClick={() => deleteBlog(props.blog)} style={removeButtonStyle}>remove</button></div>
      <h2>Comments</h2>
      {commentForm()}
      {displayComments(props.blog)}
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
  destroyBlog,
  addComment
}

export default connect(mapStateToProps, mapDispatchToProps)(Blog)