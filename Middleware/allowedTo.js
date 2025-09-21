const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');

const allowedTo = (...roles) =>
  asyncHandler((req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(new ApiError("You don't have access for this section"));
    next();
  });

module.exports = allowedTo;
