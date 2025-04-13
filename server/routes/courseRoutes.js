const express = require("express");
const router = express.Router();
const Course = require("../models/CourseSchema");

router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate("topics");
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find({});
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch courses" });
  }
});

module.exports = router;
