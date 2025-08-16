const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
// const { request } = require('../app')

usersRouter.post('/', async (request, response, next) => {
    const { username, name, password } = request.body
    //validation for username and password length
    if(!username || username.length < 3) {
        return response.status(400).json({ error: 'username must be at least 3 characters'})
    }
    if(!password || password.length < 3) {
        return response.status(400).json({ error: 'password must be at least 3 characters'})
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash
    })    

    let savedUser
    try{
        savedUser = await user.save()
    } catch(error){
       return next(error)
    }

    response.status(201).json(savedUser)
})

usersRouter.get('/', async (request, response) => {
    const usersInDb = await User.find({}).populate('blogs', {url: 1, title: 1, author: 1, id: 1 } )
    response.json(usersInDb)
})

module.exports = usersRouter