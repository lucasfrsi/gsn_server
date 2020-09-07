const { createError } = require('../middleware/helpers/error');

const postsServices = require('../services/postsServices');
const usersServices = require('../services/usersServices');

const LIKE_TYPES = ['like', 'dislike'];

const getPosts = async (req, res, next) => {
  try {
    const posts = await postsServices.getPosts('-createdAt', 1);
    if (!posts) throw createError(400, 'No posts were found.');
    res.status(200).json({ posts });
  } catch (err) {
    return next(err);
  }
};

const getPostById = async (req, res, next) => {
  const { postId } = req.params;
  try {
    const post = await postsServices.getPostById(postId);
    if (!post) throw createError(400, 'This post does not exist.');
    res.status(200).json({ post });
  } catch (err) {
    return next(err);
  }
};

const createPost = async (req, res, next) => {
  const { text, imageUrl } = req.body;
  const { user } = req;

  try {
    if (!text) throw createError(400, 'Text is required.');

    const existingUser = await usersServices.getUserById(user.id);
    if (!existingUser) throw createError(400, 'User does not exist, could not create post.');

    const post = {
      user: user.id,
      text,
      imageUrl,
    };

    const createdPost = await postsServices.createPost(post, existingUser);
    res.status(201).json({ message: 'Post has been created successfully.', post: createdPost });
  } catch (err) {
    return next(err);
  }
};

const deletePost = async (req, res, next) => {
  const { postId } = req.params;
  const { user } = req;

  try {
    const post = await postsServices.getPostById(postId, 'user', 'posts');
    if (!post) throw createError(400, 'Post does not exist, could not delete post.');
    if (post.user.id !== user.id) throw createError(403, 'You are not allowed to delete this post');
    await postsServices.deletePost(post);
    res.status(200).json({ message: 'Post has been deleted successfully' });
  } catch (err) {
    return next(err);
  }
};

const createComment = async (req, res, next) => {
  const { text } = req.body;
  const { postId } = req.params;
  const { user } = req;

  try {
    if (!text) throw createError(400, 'Text is required.');

    const post = await postsServices.getPostById(postId);
    if (!post) throw createError(400, 'Post does not exist, could not create comment for this post.');

    const existingUser = await usersServices.getUserById(user.id);
    if (!existingUser) throw createError(400, 'User does not exist, could not create comment for this post.');

    const newComment = {
      user: user.id,
      text,
    };

    post.comments.unshift(newComment);

    await post.save();

    res.status(201).json({ message: 'Comment has been created successfully.', comments: post.comments });
  } catch (err) {
    return next(err);
  }
};

const deleteComment = async (req, res, next) => {
  const { postId, commentId } = req.params;
  const { user } = req;

  try {
    const post = await postsServices.getPostById(postId);
    if (!post) throw createError(400, 'Post does not exist, could not delete comment.');

    const existingComment = post.comments.find((comment) => comment.id === commentId);
    if (!existingComment) throw createError(400, 'Comment does not exist, could not delete it.');

    const existingUser = await usersServices.getUserById(user.id);
    if (!existingUser) throw createError(400, 'User does not exist, could not create comment for this post.');

    if (user.id === existingComment.user.toString() || user.id === post.user.toString()) {
      post.comments = post.comments.filter((comment) => comment.id !== commentId);
      await post.save();
      res.status(200).json({ message: 'Comment has been deleted successfully.', comments: post.comments });
    } else {
      throw createError(403, 'Comments can only be deleted by their owner or the owner of the post.');
    }
  } catch (err) {
    return next(err);
  }
};

const likePost = async (req, res, next) => {
  const { likeType } = req.body;
  const { postId } = req.params;
  const { user } = req;

  try {
    if (!likeType) throw createError(400, 'No like type attached to the request.');
    if (!LIKE_TYPES.includes(likeType)) throw createError(400, 'There is no such like type.');

    const post = await postsServices.getPostById(postId);
    if (!post) throw createError(400, 'Post does not exist, could not (dis)like it.');

    const existingUser = await usersServices.getUserById(user.id);
    if (!existingUser) throw createError(400, 'User does not exist, could not (dis)like this post.');

    const existingLike = post.likes.filter((like) => like.user.toString() === user.id);

    if (existingLike.length < 1) {
      const newLike = {
        user: user.id,
        type: likeType,
      };
      const updatedPost = await postsServices.addLikeToPost(post, newLike);
      res.status(201).json({ message: 'Post has been (dis)liked successfully', post: updatedPost });
    } else {
      if (existingLike[0].type === likeType) {
        const updatedPost = await postsServices.deletePostLike(post, existingLike[0]);
        res.status(200).json({ message: 'Post (dis)like has been removed.', post: updatedPost });
      }

      if (existingLike[0].type !== likeType) {
        const updatedPost = await postsServices.changePostLike(post, likeType, user.id);
        res.status(200).json({ message: 'Post (dis)like has been changed successfully', post: updatedPost });
      }
    }
  } catch (err) {
    return next(err);
  }
};

exports.getPosts = getPosts;
exports.getPostById = getPostById;
exports.createPost = createPost;
exports.deletePost = deletePost;
exports.createComment = createComment;
exports.deleteComment = deleteComment;
exports.likePost = likePost;
