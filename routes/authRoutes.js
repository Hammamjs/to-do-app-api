const express = require('express');

const {
  signup,
  login,
  forgotPassword,
  verifyPassResetCode,
  resetPassowrd,
  logout,
} = require('../services/authServices');
const { signupValidator } = require('../validator/authValidator');

const router = express.Router();

router.post('/signup', signupValidator, signup);

router.post('/login', login);

router.post('/forgotPassword', forgotPassword);
router.post('/verifyCode', verifyPassResetCode);
router.put('/resetPassword', resetPassowrd);
router.post('/logout', logout);

module.exports = router;
