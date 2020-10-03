const mongoose = require('mongoose');
const { createError } = require('../middleware/helpers/error');

const Post = require('../models/Post');

const getPosts = async (sort, limit) => {
  try {
    const posts = await Post.find({}).sort(sort).limit(limit);
    return posts;
  } catch (err) {
    console.error(err);
    throw createError(500, 'Something went wrong while fetching posts, try again later.');
  }
};

const getPostById = async (postId, ...populateParams) => {
  try {
    const post = await Post.findById(postId).populate(...populateParams);
    return post;
  } catch (err) {
    console.error(err);
    throw createError(500, 'Something went wrong while fetching post, try again later.');
  }
};

const createPost = async (postData, user) => {
  const session = await mongoose.startSession();
  try {
    const post = new Post(postData);
    session.startTransaction();
    await post.save({ session });
    user.posts.push(post);
    await user.save({ session });
    await session.commitTransaction();
    session.endSession();
    return post;
  } catch (err) {
    console.error(err);
    await session.abortTransaction();
    session.endSession();
    throw createError(500, 'Something went wrong while creating the post, try again later.');
  }
};

const deletePost = async (post) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    await post.remove({ session });
    post.user.posts.pull(post);
    await post.user.save({ session });
    await session.commitTransaction();
    session.endSession();
  } catch (err) {
    console.error(err);
    await session.abortTransaction();
    session.endSession();
    throw createError(500, 'Something went wrong while deleting post, try again later.');
  }
};

const addLikeToPost = async (post, like) => {
  try {
    post.likes.push(like);
    await post.save();
    return post;
  } catch (err) {
    console.error(err);
    throw createError(500, 'Something went wrong while (dis)liking this post, try again later.');
  }
};

const deletePostLike = async (post, like) => {
  try {
    post.likes.pull(like);
    await post.save();
    return post;
  } catch (err) {
    console.error(err);
    throw createError(500, 'Something went wrong while deleting the (dis)like from the post, try again later.');
  }
};

const changePostLike = async (post, likeType, userId) => {
  const updatedPost = post;
  try {
    const likeIndex = updatedPost.likes.findIndex((like) => like.user.toString() === userId);
    updatedPost.likes[likeIndex].type = likeType;
    await updatedPost.save();
    return updatedPost;
  } catch (err) {
    console.error(err);
    throw createError(500, 'Something went wrong while changing the like type to this post, try again later.');
  }
};

const editPost = async (post) => {
  try {
    await post.save();
    return post;
  } catch (err) {
    console.error(err);
    throw createError(500, 'Something went wrong while updating this post, try again later.');
  }
};

exports.getPosts = getPosts;
exports.getPostById = getPostById;
exports.createPost = createPost;
exports.deletePost = deletePost;
exports.addLikeToPost = addLikeToPost;
exports.deletePostLike = deletePostLike;
exports.changePostLike = changePostLike;
exports.editPost = editPost;
