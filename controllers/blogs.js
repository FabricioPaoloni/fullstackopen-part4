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
            response.status(400).json({error: 'Error while saving new blog:', message: error.message})
        })
})

blogsRouter.delete('/:id', async (request, response) => {
    if(request.params.id.length !== 24 ){
        response.status(400).json({error: 'Invalid ID'})
    } else {
        await Blog.findByIdAndDelete(request.params.id)
        response.status(204).end()
    }
    
})

module.exports = blogsRouter