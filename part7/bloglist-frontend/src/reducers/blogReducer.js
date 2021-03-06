import blogService from '../services/blogs'

const blogReducer = (state = [], action) => {
  switch (action.type) {
    case 'INIT_BLOGS':
      return action.data.sort((a, b) => b.likes - a.likes)
    case 'NEW_BLOG':
      return [...state, action.data]
    case 'LIKE': {
      const id = action.data.id
      const blogToChange = state.find(b => b.id === id)
      const changedBlog = {
        ...blogToChange,
        likes: blogToChange.likes + 1
      }
      return state
        .map(b => b.id !== id ? b : changedBlog)
        .sort((a, b) => b.likes - a.likes) // sort by likes in descending order
    }
    case 'DESTROY_BLOG': {
      const id = action.data.id
      return state.filter(b => b.id !== id)
    }
    case 'ADD_COMMENT': {
      const id = action.data.id
      const newComment = action.data.newComment
      const blogToChange = state.find(b => b.id === id)
      const changedBlog = {
        ...blogToChange,
        comments: blogToChange.comments.concat(newComment)
      }
      return state.map(b => b.id !== id ? b : changedBlog)
    }
    default:
      return state
  }
}

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch({
      type: 'INIT_BLOGS',
      data: blogs
    })
  }
}

export const createBlog = (blog, loggedInUser) => {
  return async dispatch => {
    let newBlog = await blogService.create(blog)
    newBlog = {
      ...newBlog,
      user: {
        username: loggedInUser.username,
        name: loggedInUser.name,
        id: newBlog.user
      }
    }
    dispatch({
      type: 'NEW_BLOG',
      data: newBlog
    })
  }
}

export const addLike = (blog) => {
  return async dispatch => {
    const object = { ...blog, likes: blog.likes + 1 }
    await blogService.update(blog.id, object)
    dispatch({
      type: 'LIKE',
      data: { id: blog.id }
    })
  }
}

export const destroyBlog = id => {
  return async dispatch => {
    await blogService.destroy(id)
    dispatch({
      type: 'DESTROY_BLOG',
      data: { id: id }
    })
  }
}

export const addComment = (blog, newComment) => {
  return async dispatch => {
    const object = { ...blog, comments: blog.comments.concat(newComment) }
    await blogService.addComment(blog.id, object)
    dispatch({
      type: 'ADD_COMMENT',
      data: {
        id: blog.id,
        newComment: newComment
      }
    })
  }
}

export default blogReducer