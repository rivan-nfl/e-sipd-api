const express = require('express')
const { register, login } = require('./authController')

const authRouter = express.Router()

// Register
authRouter.post('/register', register)

// Login
authRouter.post('/login', login)

module.exports = authRouter