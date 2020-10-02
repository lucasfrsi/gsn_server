const express = require('express');
const router = express.Router();
const isAuthorized = require('../../middleware/authorization');

const postsControllers = require('../../controllers/postsControllers');

// Public Routes
// NO ROUTES

router.use(isAuthorized);

// Private Routes
router.post('/', postsControllers.createPost);
router.put('/:postId', postsControllers.editPost);
router.delete('/:postId', postsControllers.deletePost);

router.get('/', postsControllers.getPosts);
router.get('/:postId', postsControllers.getPostById);

router.post('/comments/:postId', postsControllers.createComment);
router.delete('/comments/:postId/:commentId', postsControllers.deleteComment);

router.post('/likes/:postId', postsControllers.likePost);

module.exports = router;
