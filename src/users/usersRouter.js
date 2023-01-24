const express = require('express');
const { getAllUsers, getUserById, editUser, deleteUser } = require('./usersController');

const usersRouter = express.Router()

// Get All Users
usersRouter.get('/', getAllUsers)

// Get User by Id
usersRouter.get('/:user_id', getUserById)

// Edit User
usersRouter.put('/:user_id', editUser)

// Delete User
usersRouter.delete('/:user_id', deleteUser)

module.exports = usersRouter