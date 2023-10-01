const express = require('express');
const {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  deactivateUser,
  getDeactivatedUsers,
  ActivateUser,
  forgotPassword,
  verifyPassResetCode,
  resetPassowrd,
  changePassword,
} = require('../Services/userServices');

const tasksRoutes = require('./tasksRoutes');
const auth = require('../Services/authServices');
const {
  getUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changePasswordValidator,
  createUserValidator,
} = require('../utils/validator/userValidator');
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

router.put('/:id/changePassword', changePasswordValidator, changePassword);

router.route('/:id/deactivate').put(deactivateUser);
router.route('/:id/activate').post(ActivateUser);

module.exports = router;
