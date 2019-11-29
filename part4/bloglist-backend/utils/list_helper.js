// dummy test
const dummy = _blogs => {
  return 1
}

// return total likes of all blogs
const totalLikes = array => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }

  return array.length === 0
    ? 0
    : array.reduce(reducer, 0)
}

// return blog with most likes
const favoriteBlog = array => {
  const reducer = (fav, item) => {
    if (item.likes >= fav.likes) {
      fav = item
    }
    return {
      title: fav.title,
      author: fav.author,
      likes: fav.likes
    }
  }

  return array.length === 0
  ? {}
  : array.reduce(reducer, { likes: -1 })
}

// return author with most blogs
const mostBlogs = array => {
  let testObj = {}
  array.map(item => {
    let itemAuthor = item.author
    if (itemAuthor in testObj) {
      testObj[itemAuthor].blogs += 1
    } else {
      testObj[itemAuthor] = { author: item.author }
      testObj[itemAuthor].blogs = 1
    }
  })

  const findTopBlogsAuthor = array => {
    const reducer = (top, item) => {
      if (item.blogs >= top.blogs) {
        top = item
      }
      return {
        author: top.author,
        blogs: top.blogs
      }
    }

    return array.length === 0
    ? {}
    : array.reduce(reducer, { blogs: 1 })
  }

  return findTopBlogsAuthor(Object.values(testObj))
}

// return author with most likes
const mostLikes = array => {
  let testObj = {}
  array.map(item => {
    let itemAuthor = item.author
    if (itemAuthor in testObj) {
      testObj[itemAuthor].likes += item.likes
    } else {
      testObj[itemAuthor] = { author: item.author }
      testObj[itemAuthor].likes = item.likes
    }
  })

  const findTopLikesAuthor = array => {
    const reducer = (top, item) => {
      if (item.likes >= top.likes) {
        top = item
      }
      return {
        author: top.author,
        likes: top.likes
      }
    }

    return array.length === 0
    ? {}
    : array.reduce(reducer, { likes: 0 })
  }

  return findTopLikesAuthor(Object.values(testObj))
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}