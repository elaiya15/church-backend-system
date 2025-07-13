
const express = require('express');
const router = express.Router();
const userController = require('../controllers/AdminLog');

// Create a new user
router.post('/createUser', userController.createUser);
//  LogIn user (or) Admin
router.post('/login', userController.login);

// // Get all users
// router.get('/', userController.getAllUsers);

// // Get a user by ID
// router.get('/:id', userController.getUserById);

// // Update a user by ID
// router.patch('/:id', userController.updateUserById);

// // Delete a user by ID
// router.delete('/:id', userController.deleteUserById);

module.exports = router;


