const blogs = [
  {
    id: '5de54c70fe8f9622392eb58f',
    title: 'Easier Node.js streams via async iteration',
    author: 'Dr. Axel Rauschmayer',
    url: 'https://2ality.com/2019/11/nodejs-streams-async-iteration.html',
    likes: 19,
    user: {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      _id: '5de4f7687d013f56f0b6d94f'
    }
  },
  {
    id: '5de6017f27f00a3cd2655838',
    title: 'Thinking in React Hooks',
    author: 'Amelia Wattenberger',
    url: 'https://wattenberger.com/blog/react-hooks',
    likes: 24,
    user: {
      username: 'ahellas',
      name: 'Arto Hellas',
      _id: '5de4f7477d013f56f0b6d94e'
    }
  },
  {
    id: '5de639e4e43a670e9cbac177',
    title: 'React Patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 19,
    user: {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      _id: '5de4f7687d013f56f0b6d94f'
    }
  }
]

const getAll = () => {
  return Promise.resolve(blogs)
}

export default { getAll }