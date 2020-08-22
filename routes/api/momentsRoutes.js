const express = require('express');
const router = express.Router();
const isAuthorized = require('../../middleware/authorization');

const momentsControllers = require('../../controllers/momentsControllers');

// Public Routes
// NO ROUTES

router.use(isAuthorized);

// Private Routes
router.post('/', momentsControllers.createMoment);
router.delete('/:momentId', momentsControllers.deleteMoment);
// REACT A MOMENT(get it by id) (react once. if same react remove, if different type just change)
// GET MOMENTS (show at home)

module.exports = router;
