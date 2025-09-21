const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { DateTime } = require('luxon');
const crypto = require('crypto');

const User = require('../models/userModel');

const {
  sendCookietoBrowser,
  createSecretToken,
  createAccessToken,
  removeCookieFromBrowser,
} = require('../utils/createToken');
const ApiError = require('../utils/apiError');
const sendEmail = require('../utils/sendEmail');
const { requiredData } = require('../utils/info');

exports.signup = asyncHandler(async (req, res) => {
  try {
    await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
      passwordChangeAt: DateTime.utc().toISO(),
    });
  } catch (err) {
    console.log(err);
  }
  res
    .status(201)
    .json({ status: 'Success', message: 'User successfully created' });
});

exports.login = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError('Email or password inncorect'));
  }
  const isMatch = await bcrypt.compare(req.body.password, user.password);
  if (!isMatch) {
    return next(new ApiError('Email or password inncorect'));
  }
  const token = createSecretToken(user._id);
  const accessToken = createAccessToken(user._id);
  user.refreshToken = token;
  await user.save();
  sendCookietoBrowser(res, token);
  res
    .status(200)
    .json({ status: 'Success', data: requiredData(user), accessToken });
});

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new ApiError('This user not exist'));
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash('sha256')
    .update(resetCode)
    .digest('hex');

  user.passwordResetCode = hashedResetCode;
  user.passwordCodeExpires = Date.now() + 10 * 60 * 1000; // valid for 10 second
  user.passwordVerify = false;

  await user.save();

  try {
    await sendEmail({
      email: user.email,
      resetCode,
    });
  } catch (err) {
    console.log(err);
    user.passwordResetCode = undefined;
    user.passwordVerify = undefined;
    user.passwordCodeExpires = undefined;
    await user.save();
    return next(
      new ApiError('We got error to send reset code to your email', 400)
    );
  }
  res.status(200).json({
    status: 'Success',
    message:
      'Reset code send successfully if email not appear in your inbox check spam area',
  });
});

exports.verifyPassResetCode = asyncHandler(async (req, res, next) => {
  console.log(req.body);
  const hashedResetCode = crypto
    .createHash('sha256')
    .update(req.body.resetCode)
    .digest('hex');

  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    passwordCodeExpires: { $gt: Date.now() },
  });

  if (!user)
    return next(
      new ApiError('This user not exist or password reset code expired', 400)
    );

  const tempToken = crypto.randomBytes(32).toString('hex');
  const hashedTempToken = crypto
    .createHash('sha256')
    .update(tempToken)
    .digest('hex');

  user.passwordResetTempToken = hashedTempToken;
  user.passwordVerify = true;
  user.passwordVerify = undefined;
  user.passwordCodeExpires = undefined;
  await user.save();
  res.status(200).json({ status: 'Success', tempToken });
});

exports.resetPassowrd = asyncHandler(async (req, res, next) => {
  const hashedTempToken = crypto
    .createHash('sha256')
    .update(req.body.token)
    .digest('hex');

  const user = await User.findOne({ passwordResetTempToken: hashedTempToken });

  if (!user) return next(new ApiError('This user not exist', 400));
  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordVerify = undefined;
  user.passwordCodeExpires = undefined;
  user.passwordResetTempToken = undefined;

  await user.save();

  res.status(200).json({
    status: 'Success',
    message: 'Reset password complete',
  });
});

exports.logout = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOneAndUpdate(
    { email },
    {
      refreshToken: '',
    }
  );
  if (!user) return next(new ApiError('User not exist', 400));
  removeCookieFromBrowser(res);

  res.status(200).json({ status: 'Success' });
});
