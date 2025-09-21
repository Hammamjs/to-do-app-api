const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const ApiError = require('../utils/apiError');

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) return next(new ApiError('Please login again to get access'));

  const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
  const currentUser = await User.findById(decoded.id);

  if (!currentUser)
    return next(new ApiError('This token that belong to this user not exist'));
  const changePasswordTimestamp = parseInt(
    currentUser.passwordChangeAt.getTime() / 1000,
    10
  );
  const user = {
    name: currentUser.name,
    _id: currentUser._id,
    role: currentUser.role,
  };

  if (User.passwordChangeAt) {
    if (changePasswordTimestamp > decoded.iat)
      return next(
        new ApiError(
          'Look like user change password currently please login again ...'
        )
      );
  }
  req.user = user;
  next();
});

module.exports = protect;
