const express = require("express");
const router = express.Router();
const adminController = require("../controller/adminController");
const {
  validateCourse,
  validateTopic,
  validateQuestion,
} = require("../middleware/validateAdmin");
const handleValidationErrors = require("../middleware/handleValidationErrors");
const userAuth = require("../middleware/authmiddleware");
const adminauth = require("../middleware/adminmiddleware");

router.use("/", userAuth, adminauth);

router.post(
  "/add-course",
  validateCourse,
  handleValidationErrors,
  adminController.addCourse
);

router.post(
  "/add-topic",
  validateTopic,
  handleValidationErrors,
  adminController.addTopic
);

router.post(
  "/add-question",
  validateQuestion,
  handleValidationErrors,
  adminController.addQuestion
);
router.get("/users", adminController.getAllUsers);

module.exports = router;
