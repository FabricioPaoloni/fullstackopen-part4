const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
// const { request } = require('../app')

blogsRouter.get('/', async (request, response) => {
    try {
        let blogs = await Blog.find({})
             .populate('user', { username: 1, name: 1, id: 1 })
        console.log(blogs)
        response.json(blogs)
    } catch (error) {
        response.status(400).send('Error happened while getting all blogs:')
    }



})


blogsRouter.post('/', (request, response) => {
    const newBlog = new Blog(request.body)
    //pondremos manualmente el user ID de momento, esto lo corregiremos en el ejercicio 4.19
    newBlog.user = "6897e04aa0841cd3bd4c6a9f"

    newBlog.save()
        .then(result => {
            response.status(201).json(result)
        })
        .catch(error => {
            response.status(400).json({ error: 'Error while saving new blog:', message: error.message })
        })
})

blogsRouter.delete('/:id', async (request, response) => {
    if (request.params.id.length !== 24) {
        response.status(400).json({ error: 'Invalid ID' })
    } else {
        await Blog.findByIdAndDelete(request.params.id)
        response.status(204).end()
    }
})

blogsRouter.put('/:id', async (request, response) => {
    if (request.params.id.length !== 24) {
        response.status(400).json({ error: 'Invalid ID' })
    } else {
        const updatedBlog = request.body
        let blogToUpdate = await Blog.findById(request.params.id)
        if (!blogToUpdate) {
            return response.status(404).end()
        }
        blogToUpdate.likes = updatedBlog.likes
        await blogToUpdate.save()
        response.status(200).json(blogToUpdate)
    }
})

module.exports = blogsRouter