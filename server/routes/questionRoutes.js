const express = require("express");
const router = express.Router();
const Question = require("../models/QuestionSchema");
const UserProgress = require("../models/UserProgressSchema");
const userAuth = require("../middleware/authmiddleware");
router.post("/submit", async (req, res) => {
  try {
    const {
      userId,
      courseId,
      topicId,
      questionId,
      selectedAnswer,
      correctAnswer,
    } = req.body;

    const progress = await UserProgress.findOne({ userId, courseId });
    if (!progress) return res.status(404).json({ msg: "Progress not found" });

    const level = progress.difficulty;

    const isCorrect = selectedAnswer === correctAnswer;

    progress.performance[level].attempted += 1;
    if (isCorrect) progress.performance[level].correct += 1;

    const topicStats = progress.questionProgress.get(topicId) || {
      attempted: 0,
      correct: 0,
      completedQuestions: [],
    };
    topicStats.attempted += 1;
    if (isCorrect) topicStats.correct += 1;
    topicStats.completedQuestions.push(questionId);

    progress.questionProgress.set(topicId, topicStats);

    await progress.save();

    res.status(200).json({ msg: "Progress updated", progress });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
});

router.get("/topic/:topicId", userAuth, async (req, res) => {
  const { topicId } = req.params;
  const userId = req.user._id;
  try {
    const progress = await UserProgress.findOne({ userId });

    if (!progress)
      return res.status(404).json({ message: "Progress not found" });

    const difficulty = progress.currentDifficulty;

    const questions = await Question.find({
      topicId,
      difficulty: { $regex: new RegExp(difficulty, "i") },
    });

    res.json({ questions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch questions" });
  }
});

module.exports = router;
