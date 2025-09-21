const { check } = require('express-validator');
const middlewareValidator = require('../middleware/validatorMiddleware');
const ApiError = require('../utils/apiError');
const User = require('../models/userModel');
const { default: slugify } = require('slugify');

exports.createTaskValidator = [
  check('title')
    .notEmpty()
    .withMessage('Title required')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check('user').custom(async (_, { req }) => {
    const userId = req.user._id.toString();
    await User.findOne({ _id: userId }).then((user) => {
      if (!user) throw new Error('This user not exist');
    });
  }),
  middlewareValidator,
];

exports.getTaskValidator = [
  check('id').isMongoId().withMessage('Invalid taskId'),
  middlewareValidator,
];

exports.updateTaskValidator = [
  check('id').isMongoId().withMessage('Invalid taskId'),
  middlewareValidator,
];

exports.deleteTaskValidator = [
  check('id').isMongoId().withMessage('Invalid taskId'),
  middlewareValidator,
];
