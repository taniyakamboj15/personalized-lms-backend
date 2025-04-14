const UserProgress = require("../models/UserProgressSchema");
const getNextDifficulty = require("../utils/getNextDifficulty");
const Course = require("../models/CourseSchema");
const recommendNextTopic = require("../utils/recommendNextTopic");
const mongoose = require("mongoose");
const User = require("../models/UserSchema");

exports.updateProgress = async (req, res) => {
  try {
    // console.log("Updating progress for user:", req.user._id);
    const { courseId, topicId, level, isCorrect, questionId, difficulty } =
      req.body;
    const userId = req.user._id;
    if (isCorrect) {
      const xpToAdd =
        difficulty === "easy" ? 5 : difficulty === "medium" ? 10 : 15;

      await User.findByIdAndUpdate(
        userId,
        { $inc: { xp: xpToAdd } },
        { new: true }
      );
    }

    const progress = await UserProgress.findOneAndUpdate(
      { userId, courseId },
      {
        $addToSet: {
          completedTopics: topicId,
          [`questionProgress.${topicId}.completedQuestions`]: questionId,
        },
        $inc: {
          [`performance.${level}.attempted`]: 1,
          [`performance.${level}.correct`]: isCorrect ? 1 : 0,
          [`questionProgress.${topicId}.attempted`]: 1,
          [`questionProgress.${topicId}.correct`]: isCorrect ? 1 : 0,
        },
      },
      { new: true }
    );

    if (!progress) {
      return res.status(404).json({ message: "Progress not found" });
    }

    const newDifficulty = getNextDifficulty(progress.performance);
    console.log("new difficluty is ", newDifficulty);

    if (progress.difficulty !== newDifficulty) {
      progress.difficulty = newDifficulty;
      await progress.save();
    }

    res.json({
      message: "Progress updated",
      progress,
      updatedDifficulty: newDifficulty,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.initalizeProgress = async (req, res) => {
  const { courseId } = req.body;
  const userId = req.user._id;
  if (
    !mongoose.Types.ObjectId.isValid(userId) ||
    !mongoose.Types.ObjectId.isValid(courseId)
  ) {
    return res.status(400).json({ message: "Invalid userId or courseId" });
  }

  try {
    console.log("Initializing progress for user:", userId, "course:", courseId);

    const exists = await UserProgress.findOne({ userId, courseId });
    if (exists) {
      console.log("Progress already exists");
      return res.status(400).json({ message: "Already initialized" });
    }

    const progress = new UserProgress({
      userId,
      courseId,
      completedTopics: [],
    });

    await progress.save();
    console.log("Progress initialized successfully");
    res.status(201).json({ message: "Progress initialized", progress });
  } catch (err) {
    console.error("Initialization Error:", err);
    res
      .status(500)
      .json({ message: "Initialization failed", error: err.message });
  }
};

exports.currentProgress = async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user._id;

  try {
    const progress = await UserProgress.findOne({ userId, courseId })
      .populate("completedTopics", "name")
      .lean();
    const totalTopics = await Course.findById(courseId).populate("topics");

    if (!progress) return res.status(404).json({ msg: "Progress not found" });

    res.status(200).json({
      courseId: progress.courseId,
      completedTopics: progress.completedTopics.map((t) => t.name),
      totalTopics: totalTopics.topics.length,
      completedTopicsCount: progress.completedTopics.length,
      difficulty: progress.difficulty,
      performance: progress.performance,
      questionProgress:
        progress.questionProgress instanceof Map
          ? Object.fromEntries(progress.questionProgress)
          : {},
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to fetch progress" });
  }
};

exports.nextTopic = async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user._id;

  if (
    !mongoose.Types.ObjectId.isValid(userId) ||
    !mongoose.Types.ObjectId.isValid(courseId)
  ) {
    return res.status(400).json({ message: "Invalid userId or courseId" });
  }

  try {
    const progress = await UserProgress.findOne({ userId, courseId });
    if (!progress)
      return res.status(404).json({ message: "Progress not found" });

    const updatedDifficulty = getNextDifficulty(progress.performance);

    if (progress.difficulty !== updatedDifficulty) {
      progress.difficulty = updatedDifficulty;
      await progress.save();
    }

    const course = await Course.findById(courseId).populate("topics");
    const completedTopics = progress.completedTopics.map((id) => id.toString());

    const nextTopic = recommendNextTopic(
      course.topics,
      completedTopics,
      updatedDifficulty
    );

    if (!nextTopic) {
      return res.status(200).json({ message: "All topics completed" });
    }

    res.json({
      nextTopic: {
        _id: nextTopic._id,
        name: nextTopic.title,
        description: nextTopic.content,
        difficulty: nextTopic.difficulty,
      },
      updatedDifficulty,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch next topic" });
  }
};
