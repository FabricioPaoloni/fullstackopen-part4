const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

console.log('connecting to DB')

mongoose.connect(process.env.MONGODB_URI)
    .then(console.log('connected to mongodb'))
    .catch(error => console.log('Error connecting to db:', error.message))

const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number
})

blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog 