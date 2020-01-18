import blogService from '../services/blogs'

const blogReducer = (state = [], action) => {
  switch (action.type) {
    case 'INIT_BLOGS':
      return action.data.sort((a, b) => b.likes - a.likes)
    case 'LIKE': {
      const id = action.data.id
      const blogToChange = state.find(b => b.id === id)
      const changedBlog = {
        ...blogToChange,
        likes: blogToChange.likes + 1
      }
      return state
        .map(b => b.id !== id ? b : changedBlog)
        .sort((a, b) => b.likes - a.likes)
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

export default blogReducer