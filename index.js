require('dotenv').config()
const express = require('express')
const cors = require('cors')
const Blog = require('./models/blog')
app = express()

app.use(express.json())
app.use(cors())

//routes

app.get('/api/blogs', (request, response) => {
    Blog.find({}).then(blogs => response.json(blogs))
        .catch(error => response.send('Error happened while getting all blogs:', error.message))
})


app.post('/api/blogs', (request, response) => {
    const newBlog = new Blog(request.body)

    newBlog.save()
        .then(result => {
            response.status(201).json(result)
        })
        .catch(error => {
            response.send('Error while saving new blog:', error.message)
        })
})


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

//error handling

const errorHandler = (error, request, resonse, next) => {
    console.log(error.message)
    //personalized error handling here:


    next(error)
}

app.use(errorHandler)

//starting app

const PORT = process.env.PORT | 3003

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})