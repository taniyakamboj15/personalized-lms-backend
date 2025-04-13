const express = require("express");
const {
  register,
  login,
  firebaseLogin,
  logout,
  verifyOtp,
  sendOtp,
} = require("../controller/authController");
const validateUserSignup = require("../middleware/validateUserSignup");

const router = express.Router();

router.post("/register", validateUserSignup, register);
router.post("/sendOtp", sendOtp); // Send OTP route
router.post("/verifyOtp", verifyOtp); // Verify OTP route
router.post("/login", login);
router.post("/firebaseLogin", firebaseLogin); // Firebase login route
router.post("/logout", logout);

module.exports = router;
