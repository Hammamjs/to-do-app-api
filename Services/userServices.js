const User = require('../models/userModel');
const factory = require('./Factory');

const { requiredData } = require('../utils/info');

const asyncHandler = require('express-async-handler');

// @desc Create new User
// @route POST api/v2/users
// @access pubic /user/admin
exports.createUser = factory.createOne(User);

// @desc get all User
// @route GET api/v2/users
// @access protected admin
exports.getUsers = factory.getAll(User);

// @desc get all User
// @route GET api/v2/users
// @access protected admin
exports.getDeactivatedUsers = asyncHandler(async (req, res, next) => {
  const user = await User.find({ active: false });
  if (!user) {
    return next(new ApiError('No user Found', 404));
  }
  res.status(200).json({
    status: 'Success',
    data: requiredData(user),
  });
});

// @desc get User by id
// @route GET api/v2/users/:id
// @access protected admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  const activateLink = `${req.protocol}://${req.get('host')}/api/v2/users/${
    req.params.id
  }/activate`;
  if (!user)
    return next(
      new ApiError(`There is no user with this id : ${req.params.id}`)
    );
  if (!user.active)
    return next(
      new ApiError(
        `Your account is deactivated to active press ${activateLink}`,
        403
      )
    );
  res.status(200).json({ status: 'Success', data: requiredData(user) });
});

// @desc Update User by id
// @route put api/v2/users/:id
// @access protected user
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    { new: true }
  );
  if (!user) return next(new ApiError('This user with this id not found', 404));
  res.status(200).json({
    status: 'Success',
    data: requiredData(user),
    message: 'Data updated successfully',
  });
});

// @desc delete User by id
// @route DELETE api/v2/users/:id
// @access protected user
exports.deleteUser = factory.deleteOne(User);

// @desc deactivate User account
// @route put api/v2/users/:id/deactivte
// @access protected user
exports.deactivateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new ApiError('This id not exist'), 404);
  user.active = false;
  await user.save();
  res
    .status(200)
    .json({ status: 'Success', message: 'User account deactivated' });
});

// @desc active User account
// @route put api/v2/users/:id/activte
// @access protected user
exports.activateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new ApiError('This id not exist'), 404);
  user.active = true;
  await user.save();
  res
    .status(200)
    .json({ status: 'Success', message: 'User account activated' });
});
