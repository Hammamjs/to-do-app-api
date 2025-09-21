const express = require('express');
const {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  deactivateUser,
  getDeactivatedUsers,
  activateUser,
} = require('../services/userServices');

const tasksRoutes = require('./tasksRoutes');
const auth = require('../services/authServices');
const {
  getUserValidator,
  updateUserValidator,
  deleteUserValidator,
  createUserValidator,
} = require('../validator/userValidator');
const router = express.Router();

router.use('/:userId/tasks', tasksRoutes);

router
  .route('/')
  .get(auth.protect, auth.allowedTo('admin'), getUsers)
  .post(createUserValidator, createUser);
router.route('/deactivate').get(getDeactivatedUsers);

router
  .route('/:id')
  .get(getUserValidator, getUser)
  .put(updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

router.put('/:id/deactivate', deactivateUser);
router.post('/:id/activate', activateUser);

module.exports = router;
