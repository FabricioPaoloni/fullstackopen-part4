const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const userExtractor = require('../utils/middleware').userExtractor
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

//auxiliary function that helps us to decode de token later
// const getTokenFrom = request => {
//     const authorization = request.get('authorization')
//     if (authorization && authorization.startsWith('Bearer ')) {
//         return authorization.replace('Bearer ', '') //eliminamos la palabra y el espacio para que solo quede el token
//     }
//     return null
// }

blogsRouter.post('/', userExtractor, async (request, response, next) => {
    const user = request.user
    // console.log(user)
    const newBlog = new Blog({
        title: request.body.title,
        author: request.body.author,
        url: request.body.url,
        likes: request.body.likes,
        user: user.id
    })

    const savedBlog = await newBlog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response, next) => {
    //verification of the id length
    if (request.params.id.length !== 24) {
        response.status(400).json({ error: 'Invalid ID' })
    }
    //search for the blog to delete in order to compare its user data with the token sended
    let blog = await Blog.findById(request.params.id)
    const user = request.user

    if(user.id.toString() !== blog.user.toString()){
        return response.status(401).json({ error: "user don't have permission to delete the blog" })
    }

    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()

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