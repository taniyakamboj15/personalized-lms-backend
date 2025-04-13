const mongoose = require("mongoose");

const userProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    completedTopics: [{ type: mongoose.Schema.Types.ObjectId, ref: "Topic" }],
    performance: {
      easy: {
        attempted: { type: Number, default: 0 },
        correct: { type: Number, default: 0 },
      },
      medium: {
        attempted: { type: Number, default: 0 },
        correct: { type: Number, default: 0 },
      },
      hard: {
        attempted: { type: Number, default: 0 },
        correct: { type: Number, default: 0 },
      },
    },
    currentTopicId: { type: mongoose.Schema.Types.ObjectId, ref: "Topic" },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "easy",
    },
    questionProgress: {
      type: Map,
      of: new mongoose.Schema({
        attempted: { type: Number, default: 0 },
        correct: { type: Number, default: 0 },
        completedQuestions: [
          { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
        ],
      }),
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("UserProgress", userProgressSchema);
