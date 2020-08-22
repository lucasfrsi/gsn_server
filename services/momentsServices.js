const mongoose = require('mongoose');
const { createError } = require('../middleware/helpers/error');

const Moment = require('../models/Moment');

const createMoment = async (moment, user) => {
  const newMoment = new Moment(moment);
  const session = await mongoose.startSession();
  try {
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
    throw createError(500, 'Something went wrong while saving the user, try again later.');
  }
};

exports.createMoment = createMoment;
