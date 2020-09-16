const express = require('express');
const router = express.Router();
const isAuthorized = require('../../middleware/authorization');

const usersControllers = require('../../controllers/usersControllers');

router.use(isAuthorized);

// Private Routes
router.get('/search/:query', usersControllers.getUsersByNickname);
router.get('/:id', usersControllers.getUserById);

// Profile Routes
router.put('/profile', usersControllers.updateProfile);

module.exports = router;
