const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

const initialUsers = [
    {
        "username": "usuario1",
        "name": "test user 1",
        "password": "prueba123"
    },
    {
        "username": "usuario2",
        "name": "test user 2",
        "password": "prueba123"
    }
]

beforeEach(async () => {
    await User.deleteMany({})
    let userObject = new User(initialUsers[0])
    await userObject.save()
    userObject = new User(initialUsers[1])
    await userObject.save()
})

describe('GET api for users', () => {
    test('GET all users from database'), async () => {
        const response = await api.get('/api/users')

        assert.strictEqual(response.body.length, initialUsers.length)
    }
})

describe('POST api for users', () => {
    test('POST a valid user must succeed', async () => {
        let newUser = {
            username: 'testUserMustSucceed',
            name: 'testUser must be created in db',
            password: 'testUser'
        }

        await api.post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-type', /application\/json/)

        let usersAtEnd = await User.find({})
        console.log(usersAtEnd)
        assert.strictEqual(usersAtEnd.length, initialUsers.length + 1)
        assert.strictEqual(usersAtEnd[2].username, 'testUserMustSucceed')
        assert.strictEqual(usersAtEnd[2].name, 'testUser must be created in db')
        // assert.strictEqual(usersAtEnd[2].password, 'testUser')
    })

    test('POST a repetead username must fail', async () => {
        let existingUser = initialUsers[0]
        let response = await api.post('/api/users')
            .send(existingUser)
            .expect(400)

        assert.strictEqual(response.body.error, 'expected `username` to be unique')
    })

    test('POST a user with a username with less than 3 characters must fail', async () => {
        let wrongUsernameUser = {
            "username": "as",
            "name": "deberia dar error",
            "password": "prueba123"
        }
        let response = await api.post('/api/users')
            .send(wrongUsernameUser)
            .expect(400)

        assert.strictEqual(response.body.error, 'username must be at least 3 characters')
    })

    test('POST a user with a password that is shorter than 3 characters must fail', async () => {
        let wrongPasswordUser = {
            "username": "usuario2",
            "name": "deberia dar error de password",
            "password": "ee"
        }
        let response = await api.post('/api/users')
            .send(wrongPasswordUser)
            .expect(400)
        
        assert.strictEqual(response.body.error, 'password must be at least 3 characters')
    })
})