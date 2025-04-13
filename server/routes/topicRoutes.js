const express = require("express");
const router = express.Router();
const Topic = require("../models/TopicSchema");

router.get("/", async (req, res) => {
  try {
    const topics = await Topic.find({});
    res.json(topics);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch topics" });
  }
});

module.exports = router;
