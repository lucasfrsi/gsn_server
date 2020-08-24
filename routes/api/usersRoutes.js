const express = require('express');
const router = express.Router();
const isAuthorized = require('../../middleware/authorization');

const usersControllers = require('../../controllers/usersControllers');

// Public Routes
router.post('/login', usersControllers.login);
router.post('/signup', usersControllers.signUp); // To-do: Allocate both login and signup to a route - controller - service structure logic

router.use(isAuthorized);

// Private Routes
// router.get('/search/:query', userControllers.getUsersByNickname);
// router.get('/:id', userControllers.getUserById);

// Profile Routes
router.put('/profile', usersControllers.updateProfile);

module.exports = router;
