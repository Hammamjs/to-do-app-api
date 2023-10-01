const { check } = require('express-validator');
const slugify = require('slugify');
const bcrypt = require('bcrypt');

const middlewareValidator = require('../../Middleware/validatorMiddleware');
const ApiError = require('../apiError');
const User = require('../../Models/userModel');

exports.createUserValidator = [
  check('name')
    .notEmpty()
    .withMessage('Name required')
    .isLength({ min: 3 })
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check('email')
    .notEmpty()
    .withMessage('Email required')
    .isEmail()
    .withMessage('Please enter valid email ')
    .custom(async (val) => {
      console.log(val);
      await User.find({ email: val }).then((email) => {
        if (email)
          return Promise.reject(
            new ApiError('This email is already used', 400)
          );
      });
    }),

  check('password')
    .notEmpty()
    .withMessage('Password required')
    .isLength({ min: 8 }),
  check('passwordConfirm')
    .notEmpty()
    .withMessage('passwordConfirm required')
    .custom((val, { req }) => {
      if (req.body.password !== val)
        throw Promise.reject(
          new ApiError('Password and passwordConfirm must match')
        );
      return true;
    }),

  middlewareValidator,
];

exports.getUserValidator = [
  check('id').isMongoId().withMessage('Invalid user id'),
  middlewareValidator,
];

exports.getUserValidator = [
  check('id').isMongoId().withMessage('Invalid user id'),
  middlewareValidator,
];

exports.updateUserValidator = [
  check('id')
    .notEmpty()
    .withMessage('User id required')
    .isMongoId()
    .withMessage('Invalid user id'),
  middlewareValidator,
];

exports.deleteUserValidator = [
  check('id').isMongoId().withMessage('Invalid user id'),
  middlewareValidator,
];

exports.changePasswordValidator = [
  check('password')
    .notEmpty()
    .withMessage('Password required')
    .custom(async (val, { req }) => {
      const user = await User.findById(req.params.id);
      if (!user) throw new ApiError('User not exist any more', 404);
      const isMatch = await bcrypt.compare(val, user.password);
      if (!isMatch)
        return Promise.reject(new ApiError('Old password is inccorect', 400));
    }),
  check('newPassword').notEmpty().withMessage('Password required'),
  check('passwordConfirm')
    .notEmpty()
    .withMessage('PasswordConfirm required')
    .custom((val, { req }) => {
      if (req.body.newPassword !== val)
        throw new Error('Password and passwordConfirm missMatch ');
      return true;
    }),
  middlewareValidator,
];
