const { check } = require('express-validator');
const middlewareValidator = require('../middleware/validatorMiddleware');
const ApiError = require('../utils/apiError');
const User = require('../models/userModel');

exports.signupValidator = [
  check('name').notEmpty().withMessage('Name required').isLength({ min: 3 }),

  check('email')
    .notEmpty()
    .withMessage('Email required')
    .isEmail()
    .withMessage('Please enter valid email ')
    .custom(async (val) => {
      const user = await User.findOne({ email: val });
      if (user) return Promise.reject(new ApiError('Email already used'));
    }),

  check('password')
    .notEmpty()
    .withMessage('Password required')
    .isLength({ min: 8 }),
  check('confirmPassword')
    .notEmpty()
    .withMessage('Password confirmation required')
    .custom((val, { req }) => {
      if (req.body.password !== val)
        return new ApiError('Password and confirmPassword must match');
      return true;
    }),

  middlewareValidator,
];

exports.loginValidator = [
  check('email')
    .notEmpty()
    .withMessage('Email required')
    .isEmail()
    .withMessage('Please enter valid email '),
  check('password').notEmpty().withMessage('Password required'),
  middlewareValidator,
];
