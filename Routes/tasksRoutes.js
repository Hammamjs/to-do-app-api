const express = require('express');
const {
  getTasks,
  createTask,
  updateTask,
  getTask,
  deleteTask,
  ongoingTask,
  completeTask,
} = require('../services/tasksServices');

const protectdRoute = require('../middleware/protectedRoute');
const allowedTo = require('../middleware/allowedTo');
const { setUserFilter, insertUserId } = require('../middleware/FilterBasedOn');

const {
  createTaskValidator,
  getTaskValidator,
  deleteTaskValidator,
  updateTaskValidator,
} = require('../validator/tasksValidator');
const router = express.Router({ mergeParams: true });

// router.use(protectdRoute);

router
  .route('/')
  .get(protectdRoute, allowedTo('user'), setUserFilter, getTasks)
  .post(
    protectdRoute,
    allowedTo('user'),
    insertUserId,
    createTaskValidator,
    createTask
  );

router
  .route('/:id')
  .get(protectdRoute, allowedTo('admin', 'user'), getTaskValidator, getTask)
  .put(updateTaskValidator, updateTask)
  .delete(
    protectdRoute,
    allowedTo('user', 'admin'),
    deleteTaskValidator,
    deleteTask
  );

// Change task status
router.put(
  '/:id/status/ongoing',
  protectdRoute,
  allowedTo('user'),
  ongoingTask
);
router.put(
  '/:id/status/complete',
  protectdRoute,
  allowedTo('user'),
  completeTask
);

module.exports = router;
