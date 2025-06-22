const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
    {
        title: 'test1',
        author: 'user1',
        url: 'https://...',
        likes: 1
    },
    {
        title: 'test2',
        author: 'user2',
        url: 'https://...',
        likes: 2
    }
]

beforeEach(async() => {
    await Blog.deleteMany({})
    let blogObject = new Blog(initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(initialBlogs[1])
    await blogObject.save()
})

test("all blogs are returned", async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, initialBlogs.length)
})

test("the unique identifier property is called id", async() =>{
    const response = await api.get('/api/blogs')
    
    assert(Object.hasOwn(response.body[0], 'id'))
    assert(Object.hasOwn(response.body[1], 'id'))
})

test('POST creates a new blog successfully', async () => {
    const newBlog = {
        title: 'test3',
        author: 'author3',
        url: 'http link',
        likes: 3
    }

    await api.post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-type', /application\/json/)

    blogsAtEnd = await Blog.find({})
    // console.log(blogsAtEnd)
    assert.strictEqual(blogsAtEnd.length, initialBlogs.length + 1)
    assert(blogsAtEnd[2].title, 'test3')
    assert(blogsAtEnd[2].author, 'author3')
    assert(blogsAtEnd[2].url, 'http link')
    assert(blogsAtEnd[2].likes, 3)
})

after(async () => {
    await mongoose.connection.close()
})