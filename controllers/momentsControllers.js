const { createError } = require('../middleware/helpers/error');

const momentsServices = require('../services/momentsServices');
const usersServices = require('../services/usersServices');

const createMoment = async (req, res, next) => {
  const { title, text, imageUrl } = req.body;
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
      imageUrl,
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
    if (moment.user.id !== user.id) throw createError(401, 'You are not allowed to delete this moment');
    await momentsServices.deleteMoment(moment);
  } catch (err) {
    return next(err);
  }

  res.status(200).json({ message: 'Moment has been deleted successfully' });
};

exports.createMoment = createMoment;
exports.deleteMoment = deleteMoment;
