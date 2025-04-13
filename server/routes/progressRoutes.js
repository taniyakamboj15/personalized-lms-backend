const express = require("express");
const router = express.Router();
const {
  updateProgress,
  initalizeProgress,
  currentProgress,
  nextTopic,
} = require("../controller/progressController");
const userAuth = require("../middleware/authmiddleware");

router.post("/update", userAuth, updateProgress);
router.post("/init", userAuth, initalizeProgress);
router.get("/current/:courseId", userAuth, currentProgress);
router.get("/next-topic/:courseId", userAuth, nextTopic);

module.exports = router;
