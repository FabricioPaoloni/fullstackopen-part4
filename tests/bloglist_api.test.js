const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const api = supertest(app)

const initialUsers = [
    {
        username: "usuarioTest",
        name: "Usuario de test",
        passwordHash: "$2b$10$U5S0rXlQjrMPMg4dex4l4.eh1h4SPskR1zqCPv1PQZN1xbTIJq1wi", 
        blogs: [],
    }
]

const initialBlogs = [
    {
        title: 'test1',
        author: 'user1',
        url: 'https://...',
        likes: 1,
        // user: testUser.id
    },
    {
        title: 'test2',
        author: 'user2',
        url: 'https://...',
        likes: 2,
        // user: testUser.id
    }
]
let login
beforeEach(async () => {
    await User.deleteMany({})
    let user = new User(initialUsers[0])
    testUser = await user.save()
    
    
    login = await api.post('/api/login').send({username: testUser.username, password: 'prueba123'})
    // console.log(login.body)
    await Blog.deleteMany({})
    let blogObject = new Blog(initialBlogs[0])
    blogObject.user = testUser.id
    await blogObject.save()
    blogObject = new Blog(initialBlogs[1])
    blogObject.user = testUser.id
    await blogObject.save()
})

test("all blogs are returned", async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, initialBlogs.length)
})

test("the unique identifier property is called id", async () => {
    const response = await api.get('/api/blogs')

    assert(Object.hasOwn(response.body[0], 'id'))
    assert(Object.hasOwn(response.body[1], 'id'))
})

test('POST creates a new blog successfully', async () => {
    const newBlog = {
        title: 'test3',
        author: 'exercise 4.10',
        url: 'http link',
        likes: 3
    }
    // console.log(login.body.token)
    await api.post('/api/blogs')
        .send(newBlog)
        .set('authorization', `Bearer ${login.body.token}`)
        .expect(201)
        .expect('Content-type', /application\/json/)

    blogsAtEnd = await Blog.find({})
    // console.log(blogsAtEnd)
    assert.strictEqual(blogsAtEnd.length, initialBlogs.length + 1)
    assert(blogsAtEnd[2].title, 'test3')
    assert(blogsAtEnd[2].author, 'exercise 4.10')
    assert(blogsAtEnd[2].url, 'http link')
    assert(blogsAtEnd[2].likes, 3)
})

test('if likes property is missing then default to value 0', async () => {
    const newBlog = {
        title: 'missing likes property',
        author: 'exercise 4.11',
        url: 'some url'
    }

    await api.post('/api/blogs')
        .send(newBlog)
        .set('authorization', `Bearer ${login.body.token}`)
        .expect(201)
        .expect('Content-type', /application\/json/)

    blogsAtEnd = await Blog.find({})
    // console.log(blogsAtEnd)
    assert.strictEqual(blogsAtEnd[2].likes, 0)
})

test('POST missing title property must fail', async () => {
    const newBlog = {
        author: 'exercise 4.12',
        url: 'http://titleismissing.fail',
        likes: 412
    }

    const response = await api.post('/api/blogs')
        .send(newBlog)
        .set('authorization', `Bearer ${login.body.token}`)
        .expect(400)
    // console.log(response)
})

test('POST missing url property must fail', async () => {
    const newBlog = {
        title: 'url property is missing',
        author: 'exercise 4.12',
        likes: 412
    }

    const response = await api.post('/api/blogs')
        .send(newBlog)
        .set('authorization', `Bearer ${login.body.token}`)
        .expect(400)
    // console.log(response)
})
describe('Deleting a blog: testing api.delete', () => {
    test('deleting a blog in the list must work', async () => {
        const query = await api.get('/api/blogs')
        const blogsAtBegining = query.body
        // console.log(blogsAtBegining)
        let deleted = await api
            .delete(`/api/blogs/${blogsAtBegining[1].id}`)
            .set('authorization', `Bearer ${login.body.token}`)

        const query2 = await api.get('/api/blogs')
        const blogsAtEnd = query2.body
        // console.log(blogsAtEnd)
        assert.strictEqual(blogsAtEnd.length, blogsAtBegining.length - 1)
    })

    test('Deleting a blog with invalid id must fail', async () => {
        const query = await api.get('/api/blogs')
        const blogsAtBegining = query.body
        // console.log(blogsAtBegining)
        let wrongId = '1234567890123456789034'
        let notDeleted = await api
            .delete(`/api/blogs/${wrongId}`)
            .set('authorization', `Bearer ${login.body.token}`)
        // console.log(notDeleted)
        const query2 = await api.get('/api/blogs')
        const blogsAtEnd = query2.body
        assert.equal(notDeleted.status, 400)
        assert.strictEqual(blogsAtEnd.length, blogsAtBegining.length)
    })

    test('Deleting a blog with empty id must not modify the DB', async () => {
        const query = await api.get('/api/blogs')
        const blogsAtBegining = query.body
        // console.log(blogsAtBegining)
        let emptyId = ''
        let notDeleted = await api.delete(`/api/blogs/${emptyId}`)
        // console.log(notDeleted.body)
        const query2 = await api.get('/api/blogs')
        const blogsAtEnd = query2.body

        assert.strictEqual(blogsAtEnd.length, blogsAtBegining.length)
    })
})

describe('Testing PUT functionality...', () => {
    test('changing the numbers of likes of a valid blog', async () => {
        let query = await api.get('/api/blogs')
        let blogsAtBegining = query.body
        // console.log(blogsAtBegining)
        let updateBlog = {
            title: blogsAtBegining[0].title,
            author: blogsAtBegining[0].author,
            url: blogsAtBegining[0].url,
            likes: blogsAtBegining[0].likes + 1
        }

        let update = await api.put(`/api/blogs/${blogsAtBegining[0].id}`)
            .send(updateBlog)

        query = await api.get('/api/blogs')
        blogsAtEnd = query.body
        // console.log(blogsAtEnd)

        assert.equal(update.status, 200)
        assert.strictEqual(blogsAtEnd[0].likes, 2)
    })

    test('changing the numbers of likes of a non existing id', async () => {
        let query = await api.get('/api/blogs')
        let blogsAtBegining = query.body
        let wrongId = '123456789012345678901234'
        // console.log(blogsAtBegining)
        let updateBlog = {
            title: blogsAtBegining[0].title,
            author: blogsAtBegining[0].author,
            url: blogsAtBegining[0].url,
            likes: blogsAtBegining[0].likes + 1
        }

        let update = await api.put(`/api/blogs/${wrongId}`)
            .send(updateBlog)

        assert.equal(update.status, 404)
    })

    test('changing the numbers of likes of an invalid id', async () => {
        let query = await api.get('/api/blogs')
        let blogsAtBegining = query.body
        let wrongId = '1234567890123456789012'
        // console.log(blogsAtBegining)
        let updateBlog = {
            title: blogsAtBegining[0].title,
            author: blogsAtBegining[0].author,
            url: blogsAtBegining[0].url,
            likes: blogsAtBegining[0].likes + 1
        }

        let update = await api.put(`/api/blogs/${wrongId}`)
            .send(updateBlog)

        assert.equal(update.status, 400)
    })
})


after(async () => {
    await mongoose.connection.close()
})