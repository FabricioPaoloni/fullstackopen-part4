const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {
    Blog.find({}).then(blogs => response.json(blogs))
        .catch(error => response.send('Error happened while getting all blogs:', error.message))
})


blogsRouter.post('/', (request, response) => {
    const newBlog = new Blog(request.body)

    newBlog.save()
        .then(result => {
            response.status(201).json(result)
        })
        .catch(error => {
            response.send('Error while saving new blog:', error.message)
        })
})

module.exports = blogsRouter