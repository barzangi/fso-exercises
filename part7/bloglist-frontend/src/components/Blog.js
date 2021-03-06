import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { setNotification } from '../reducers/notificationReducer'
import { addLike, destroyBlog, addComment } from '../reducers/blogReducer'
import { useField } from '../hooks'
import blogService from '../services/blogs'
import { setUser } from '../reducers/userReducer'

// import PropTypes from 'prop-types'

// styling
import styled from 'styled-components'

const Button = styled.button`
  background: Beige;
  font-size: 1em;
  margin: 0.25em;
  padding: 0.25em, 1em;
  border: 2px, solid, Indigo;
  border-radius: 3px
`

const Input = styled.input`
  margin: 0.25em;
`

const Blog = (props) => {
  const { value:newComment, bind:bindNewComment, reset:resetNewComment } = useField('text')

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      props.setUser(user)
    }
    // eslint-disable-next-line
  }, [])

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
      await props.addComment(blog, newComment)
      resetNewComment()
    } else {
      props.setNotification('Comment cannot be empty', false, 3)
    }
  }

  const commentForm = () => (
    <form onSubmit={addComment}>
      <Input {...bindNewComment} /> <Button type='submit' primary=''>add comment</Button>
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
      <div>{props.blog.likes} likes <Button type='text' onClick={() => like(props.blog)}>like</Button></div>
      <div>Added by {props.blog.user.name}</div>
      <div><Button type='text' onClick={() => deleteBlog(props.blog)} style={removeButtonStyle}>remove</Button></div>
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
  addComment,
  setUser
}

export default connect(mapStateToProps, mapDispatchToProps)(Blog)