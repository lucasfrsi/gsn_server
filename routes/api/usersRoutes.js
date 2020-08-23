const express = require('express');
const router = express.Router();
const isAuthorized = require('../../middleware/authorization');

const usersControllers = require('../../controllers/usersControllers');

// Public Routes
router.post('/login', usersControllers.login);
router.post('/signup', usersControllers.signUp); // Allocate both login and signup to a route - controller - service structure logic

router.use(isAuthorized);

// Private Routes
// router.get('/search/:query', userControllers.getUsersByNickname);
// router.get('/:id', userControllers.getUserById);

module.exports = router;
