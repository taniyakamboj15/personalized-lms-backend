const express = require("express");
const router = express.Router();
const Feedback = require("../models/FeedBack");

router.post("/", async (req, res) => {
  try {
    const { name, email, rating, message } = req.body;
    const newFeedback = new Feedback({ name, email, rating, message });
    await newFeedback.save();
    res.status(201).json({ message: "Feedback submitted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching feedback" });
  }
});

module.exports = router;
