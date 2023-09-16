const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { DateTime } = require("luxon");
const crypto = require("crypto");

const User = require("../Models/userModel");

const { createToken, sendCookietoBrowser } = require("../utils/createToken");
const ApiError = require("../utils/apiError");
const sendEmail = require("../utils/sendEmail");

exports.signup = asyncHandler(async (req, res) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
    passwordChangeAt: DateTime.utc().toISO(),
  });
  const token = createToken(user._id);
  sendCookietoBrowser(res, token);
  res.status(201).json({ status: "Success", data: user, token });
});

exports.login = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  const isMatch = await bcrypt.compare(req.body.password, user.password);
  if (!user || !isMatch) {
    return next(new ApiError("Email or password inncorect"));
  }
  const token = createToken(user._id);
  sendCookietoBrowser(res, token);
  res.status(200).json({ status: "Success", data: user, token });
});

exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) return next(new ApiError("Please login again to get access"));

  const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
  const currentUser = await User.findById(decoded.id);

  if (!currentUser)
    return next(new ApiError("This token that belong to this user not exist"));
  const changePasswordTimestamp = parseInt(
    currentUser.passwordChangeAt.getTime() / 1000,
    10
  );
  if (User.passwordChangeAt) {
    if (changePasswordTimestamp > decoded.iat)
      return next(
        new ApiError(
          "Look like user change password currently please login again ..."
        )
      );
  }
  (req.user = currentUser), next();
});

exports.allowedTo = (...roles) =>
  asyncHandler((req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(new ApiError("You dont have access for this section"));
    next();
  });

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new ApiError("This user not exist"));
  const resetCode = Math.floor(900000 + Math.random() * 100000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  user.passwordResetCode = hashedResetCode;
  user.passwordCodeExpires = Date.now() + 10 * 60 * 1000;
  user.passwordVerify = false;

  await user.save();

  const message = `Hi ${user.name},\n we received request to reset password please enter this code ${resetCode} to reset your password`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Password reset code valid for 10 mins",
      message,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordVerify = undefined;
    user.passwordCodeExpires = undefined;
    await user.save();
    return next(
      new ApiError("We got error to send reset code to your email", 400)
    );
  }
  res.status(200).json({
    status: "Success",
    message:
      "Reset code send successfully if email not appear in your inbox check spam area",
  });
});

exports.verifyPassResetCode = asyncHandler(async (req, res, next) => {
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");

  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    passwordCodeExpires: { $gt: Date.now() },
  });
  if (!user)
    return next(
      new ApiError("This user not exist or password reset code expired", 400)
    );
  user.passwordVerify = true;
  await user.save();
  res.status(200).json({ status: "Success" });
});

exports.resetPassowrd = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) return next(new ApiError("This user not exist", 400));
  (user.password = req.body.newPassword), (user.passwordResetCode = undefined);
  user.passwordVerify = undefined;
  user.passwordCodeExpires = undefined;

  await user.save();

  const token = createToken(user._id);

  res
    .status(200)
    .json({ status: "Success", message: "Reset password complete", token });
});
