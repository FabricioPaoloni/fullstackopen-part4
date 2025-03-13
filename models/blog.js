const mongoose = require('mongoose')
const logger = require('../utils/logger')
const config = require('../utils/config')

mongoose.set('strictQuery', false)

console.log('connecting to DB')

mongoose.connect(config.MONGODB_URI)
    .then(logger.info('connected to mongodb'))
    .catch(error => logger.error('Error connecting to db:', error.message))

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