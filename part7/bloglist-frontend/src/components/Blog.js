import React, { useState } from 'react'
// import PropTypes from 'prop-types'

const Blog = ({ blog, addLike, destroyBlog, loggedInUser }) => {
  const [expandedBlog, setExpandedBlog] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 5,
    paddingBottom: 10,
    border: 'solid',
    borderWidth: 1,
    marginTop: 5
  }

  const blogDetailsStyle = { display: expandedBlog ? '' : 'none' }
  const removeButtonStyle = { display: blog.user.username === loggedInUser.username ? '' : 'none' }

  return (
    <div style={blogStyle} className='blogPost'>
      <div onClick={() => setExpandedBlog(!expandedBlog)} className='blogHeader'>
        {blog.title} - {blog.author}
      </div>
      <div style={blogDetailsStyle} className='blogDetails'>
        <div><a href={blog.url}>{blog.url}</a></div>
        <div>{blog.likes} likes <button type='text' onClick={addLike}>like</button></div>
        <div>Added by {blog.user.name}</div>
        <div><button type='text' onClick={destroyBlog} style={removeButtonStyle}>remove</button></div>
      </div>
    </div>
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

export default Blog