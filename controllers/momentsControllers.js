const fs = require('fs');
const { createError } = require('../middleware/helpers/error');

const momentsServices = require('../services/momentsServices');
const usersServices = require('../services/usersServices');

const REACTION_TYPES = ['grr', 'haha', 'like', 'love', 'nani', 'sob'];

const createMoment = async (req, res, next) => {
  const { title, text } = req.body;
  const userId = req.user.id;

  if (title.trim().length < 1 || title.trim().length > 50) return next(createError(400, 'Title must be between 1 and 50 characters.'));
  if (text.trim().length < 1 || text.trim().length > 150) return next(createError(400, 'Text must be between 1 and 150 characters.'));

  let user;
  try {
    user = await usersServices.getUserById({ _id: userId });
    if (!user) throw createError(400, 'User does not exist, could not create moment.');
  } catch (err) {
    return next(err);
  }

  let createdMoment;
  try {
    const moment = {
      user: userId,
      title,
      text,
      imageUrl: req.file.path,
    };
    createdMoment = await momentsServices.createMoment(moment, user);
  } catch (err) {
    return next(err);
  }

  res.status(201).json({ message: 'Moment has been created successfully.', moment: createdMoment });
};

const deleteMoment = async (req, res, next) => {
  const { momentId } = req.params;
  const { user } = req;

  let moment;
  try {
    moment = await momentsServices.getMomentById(momentId, 'user', 'moments');
    if (!moment) throw createError(400, 'Moment does not exist, could not delete moment.');
    if (moment.user.id !== user.id) throw createError(403, 'You are not allowed to delete this moment');
    await momentsServices.deleteMoment(moment);
  } catch (err) {
    return next(err);
  }

  const imagePath = moment.imageUrl;
  fs.unlink(imagePath, (err) => {
    console.error(err);
  });

  res.status(200).json({ message: 'Moment has been deleted successfully' });
};

const reactMoment = async (req, res, next) => {
  const { momentId } = req.params;
  const { user } = req;
  const { reactionType } = req.body;

  let moment;

  try {
    if (!reactionType) throw createError(400, 'No reaction type attached to the request.');
    if (!REACTION_TYPES.includes(reactionType)) throw createError(400, 'There is no such reaction type.');
    moment = await momentsServices.getMomentById(momentId, 'user', 'nickname avatar');
    if (!moment) throw createError(400, 'Moment does not exist, could not react to this moment.');
    const existingReaction = moment.reactions.filter((reaction) => reaction.user.toString() === user.id);

    if (existingReaction.length < 1) {
      const newReaction = {
        user: user.id,
        type: reactionType,
      };
      const updatedMoment = await momentsServices.addReactionToMoment(moment, newReaction);
      res.status(201).json({ message: 'Moment reaction has been added successfully', moment: updatedMoment });
    } else {
      if (existingReaction[0].type === reactionType) {
        const updatedMoment = await momentsServices.deleteMomentReaction(moment, existingReaction[0]);
        res.status(200).json({ message: 'Moment reaction has been deleted.', moment: updatedMoment });
      }

      if (existingReaction[0].type !== reactionType) {
        const updatedMoment = await momentsServices.changeMomentReaction(moment, reactionType, user.id);
        res.status(200).json({ message: 'Moment reaction has been changed successfully', moment: updatedMoment });
      }
    }
  } catch (err) {
    return next(err);
  }
};

const getMoments = async (req, res, next) => {
  let moments;
  try {
    moments = await momentsServices.getMoments('-createdAt', 3, 'user', 'nickname avatar');
    res.status(200).json({ moments });
  } catch (err) {
    return next(err);
  }
};

exports.createMoment = createMoment;
exports.deleteMoment = deleteMoment;
exports.reactMoment = reactMoment;
exports.getMoments = getMoments;
