const asyncHandler = require('express-async-handler');
const Task = require('../models/tasksModel');
const User = require('../models/userModel');
const factory = require('./Factory');

// @desc Create task
// @route POST api/v2/tasks
// @access protected user
exports.createTask = factory.createOne(Task);

// @desc Get tasks
// @route GET api/v2/tasks
// @access protected user
exports.getTasks = factory.getAll(Task);

// @desc Get task
// @route GET api/v2/tasks
// @access protected user
exports.getTask = factory.getOne(Task);

// @desc Update task
// @route PUT api/v2/tasks/:id
// @access protected user
exports.updateTask = factory.updateOne(Task);

// @desc Delete task
// @route DELETE api/v2/tasks/:id
// @access protected user
exports.deleteTask = factory.deleteOne(Task);

// @desc change task status to ongoing task
// @route put api/v2/tasks/:id/status/ongoing
// @access protected user
exports.ongoingTask = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) return next(new ApiError('This user no longer exisit', 404));
  const task = await Task.findById(req.params.id);
  if (!task)
    return next(new ApiError('This task no longer exist or deleted', 404));
  task.status = 'ongoing';
  await task.save();
  res
    .status(200)
    .json({ status: 'Success', message: 'Task status changed', task });
});

// @desc change task status to complete task
// @route put api/v2/tasks/:id/status/complete
// @access protected user
exports.completeTask = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) return next(new ApiError('This user no longer exisit', 404));
  const task = await Task.findById(req.params.id);
  if (!task)
    return next(new ApiError('This task no longer exist or deleted', 404));
  task.status = 'complete';
  await task.save();
  res
    .status(200)
    .json({ status: 'Success', message: 'Task status changed', task });
});
