const { ApolloServer, UserInputError, gql } = require('apollo-server')
const mongoose = require('mongoose')
const Book = require('./models/book')
const Author = require('./models/author')
const config = require('./utils/config')
// const uuid = require('uuid/v1')

/*
let authors = [
  {
    name: 'Robert Martin',
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963
  },
  {
    name: 'Fyodor Dostoevsky',
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821
  },
  { 
    name: 'Joshua Kerievsky', // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  { 
    name: 'Sandi Metz', // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  }
]
*/
/*
let books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Agile Software Development',
    published: 2002,
    author: 'Robert Martin',
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ['agile', 'patterns', 'design']
  },
  {
    title: 'Refactoring, Edition 2',
    published: 2018,
    author: 'Martin Fowler',
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Refactoring to Patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'patterns']
  },  
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'design']
  },
  {
    title: 'Crime and Punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'crime']
  },
  {
    title: 'The Demon',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'revolution']
  }
]
*/

mongoose.set('useFindAndModify', false)

console.log('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  useCreateIndex: true
})
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB', error.message)
  })

const typeDefs = gql`
  type Author {
    name: String!
    born: String
    bookCount: Int!
    id: ID!
  }

  type Book {
    title: String!
    published: String!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!
      published: String!
      author: String!
      genres: [String!]!
    ): Book
    editAuthor(
      name: String!
      born: String!
    ): Author
  }
`

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: (root, args) => {
      return Book.find({}).populate('author', { name: 1 })
      // TODO: FIX FILTERS TO WORK WITH MONGOOSE
      /*if (args.author) {
        returnedBooks = returnedBooks.filter(b => b.author === args.author)
      }
      if (args.genre) {
        returnedBooks = returnedBooks.filter(b => b.genres.includes(args.genre))
      }*/
    },
    allAuthors: () => Author.find({})
  },
  Author: {
    // TODO: FIX BOOK COUNT
    bookCount: (root) => Book.collection.countDocuments({ "author.name": root.name })
  },
  Mutation: {
    addBook: async (root, args) => {
      const checkAuthorExists = async authorName => {
        const authorExists = await Author.findOne({ name: authorName })
        if (!authorExists) {
          // if author doesn't exists, add to list
          const author = new Author({ name: authorName, born: null })
          try {
            const savedAuthor = await author.save()
            return savedAuthor
          } catch (error) {
            throw new UserInputError(error.message, {
              invalidArgs: args
            })
          }
        } else {}
        return authorExists
      }

      const getAuthor = await checkAuthorExists(args.author)
      const book = new Book({ ...args, author: getAuthor })
      try {
        await book.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args
        })
      }
      return book
    },
    // TODO: FIX EDITING AUTHOR BIRTH YEAR
    editAuthor: (root, args) => {
      const author = authors.find(a => a.name === args.name)
      if (!author) return null
      const updatedAuthor = { ...author, born: args.born }
      authors = authors.map(a => a.name === args.name ? updatedAuthor : a)
      return updatedAuthor
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})