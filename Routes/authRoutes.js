const express = require("express");

const {
  signup,
  login,
  forgotPassword,
  verifyPassResetCode,
  resetPassowrd,
} = require("../Services/authServices");
const { signupValidator } = require("../utils/validator/authValidator");

const router = express.Router();

router.post("/signup", signupValidator, signup);

router.post("/login", login);

router.post("/forgotPassword", forgotPassword);
router.post("/verifyPassword", verifyPassResetCode);
router.put("/resetPassword", resetPassowrd);

module.exports = router;
