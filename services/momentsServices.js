const mongoose = require('mongoose');
const { createError } = require('../middleware/helpers/error');

const Moment = require('../models/Moment');

const createMoment = async (moment, user) => {
  const session = await mongoose.startSession();
  try {
    const newMoment = new Moment(moment);
    session.startTransaction();
    await newMoment.save({ session });
    user.moments.push(newMoment);
    await user.save({ session });
    await session.commitTransaction();
    session.endSession();
    return newMoment;
  } catch (err) {
    console.error(err);
    await session.abortTransaction();
    session.endSession();
    throw createError(500, 'Something went wrong while creating the moment, try again later.');
  }
};

const getMomentById = async (momentId, populateParams, populateSubParams) => {
  try {
    const moment = await Moment.findById(momentId).populate(populateParams, populateSubParams);
    return moment;
  } catch (err) {
    console.error(err);
    throw createError(500, 'Something went wrong while fetching moment, try again later.');
  }
};

const deleteMoment = async (moment) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    await moment.remove({ session });
    moment.user.moments.pull(moment);
    await moment.user.save({ session });
    await session.commitTransaction();
    session.endSession();
  } catch (err) {
    console.error(err);
    await session.abortTransaction();
    session.endSession();
    throw createError(500, 'Something went wrong while deleting moment, try again later.');
  }
};

const addReactionToMoment = async (moment, reaction) => {
  try {
    moment.reactions.push(reaction);
    await moment.save();
    return moment;
  } catch (err) {
    console.error(err);
    throw createError(500, 'Something went wrong while reacting to this moment, try again later.');
  }
};

const deleteMomentReaction = async (moment, reaction) => {
  try {
    moment.reactions.pull(reaction);
    await moment.save();
    return moment;
  } catch (err) {
    console.error(err);
    throw createError(500, 'Something went wrong while deleting the reaction to this moment, try again later.');
  }
};

const changeMomentReaction = async (moment, reactionType, userId) => {
  const updatedMoment = moment;
  try {
    const reactionIndex = updatedMoment.reactions.findIndex((reaction) => reaction.user.toString() === userId);
    updatedMoment.reactions[reactionIndex].type = reactionType;
    await updatedMoment.save();
    return updatedMoment;
  } catch (err) {
    console.error(err);
    throw createError(500, 'Something went wrong while changing the reaction to this moment, try again later.');
  }
};

exports.createMoment = createMoment;
exports.getMomentById = getMomentById;
exports.deleteMoment = deleteMoment;
exports.addReactionToMoment = addReactionToMoment;
exports.deleteMomentReaction = deleteMomentReaction;
exports.changeMomentReaction = changeMomentReaction;
