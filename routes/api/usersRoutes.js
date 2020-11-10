const express = require('express');
const router = express.Router();
const isAuthorized = require('../../middleware/authorization');
const fileUpload = require('../../middleware/file-upload');
const usersControllers = require('../../controllers/usersControllers');

router.use(isAuthorized);

// Private Routes

// Profile Routes
router.put('/profile', usersControllers.updateProfile);
router.put('/avatar', fileUpload.single('image'), usersControllers.updateAvatar);
router.put('/cover', fileUpload.single('image'), usersControllers.updateCover);

// Get random user & user search
router.get('/random', usersControllers.getRandomUser);
router.get('/search/:query', usersControllers.getUsersByNickname);

// Get user by ID
router.get('/:id', usersControllers.getUserById);

module.exports = router;
