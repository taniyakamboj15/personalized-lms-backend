const express = require("express");
const {
  getUserProfile,
  updateUserProfile,
  updateUserPassword,
  deleteUserAccount,
  getUserDashboard,
} = require("../controller/userController");

const userAuth = require("../middleware/authmiddleware");
const router = express.Router();

router.use(userAuth);
router.get("/profile", getUserProfile);
router.put("/update-profile", updateUserProfile);
router.put("/update-password", updateUserPassword);
router.delete("/delete", deleteUserAccount);
router.get("/dashboard", userAuth, getUserDashboard);

module.exports = router;
