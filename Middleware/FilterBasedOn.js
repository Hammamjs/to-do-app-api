const asyncHandler = require('express-async-handler');
// insert user id
exports.insertUserId = asyncHandler((req, res, next) => {
  let objectFilter = { ...req.body };
  if (!objectFilter.user) objectFilter.user = req.user._id.toString();
  req.object = objectFilter;
  next();
});

exports.setUserFilter = asyncHandler((req, res, next) => {
  let filterObj = {};
  if (req.user) filterObj = { user: req.user._id };
  req.filterObj = filterObj;
  next();
});
