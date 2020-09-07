const express = require('express');
const router = express.Router();
const isAuthorized = require('../../middleware/authorization');

const authControllers = require('../../controllers/authControllers');

// Public Routes
router.post('/login', authControllers.login);
router.post('/signup', authControllers.signUp);

router.use(isAuthorized);

// Private Routes
router.get('/', authControllers.loadUser);

module.exports = router;
