const express = require('express');

const controller = require('../../controllers/usersController');

const router = express.Router();

// @Route  POST api/users/
router.post('/', controller.registerUser);

module.exports = router;
