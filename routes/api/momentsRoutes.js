const express = require('express');
const router = express.Router();

const fileUpload = require('../../middleware/file-upload');
const isAuthorized = require('../../middleware/authorization');

const momentsControllers = require('../../controllers/momentsControllers');

// Public Routes
// NO ROUTES

router.use(isAuthorized);

// Private Routes
router.get('/', momentsControllers.getMoments);
router.post('/', fileUpload.single('image'), momentsControllers.createMoment);
router.post('/react/:momentId', momentsControllers.reactMoment);
router.delete('/:momentId', momentsControllers.deleteMoment);

module.exports = router;
