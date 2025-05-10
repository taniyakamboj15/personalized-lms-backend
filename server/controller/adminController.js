// === controllers/adminController.js ===
const Course = require("../models/CourseSchema");
const Topic = require("../models/TopicSchema");
const Question = require("../models/QuestionSchema");
const User = require("../models/UserSchema");

exports.addCourse = async (req, res) => {
  const { title, description, difficulty } = req.body;
  try {
    const course = new Course({ title, description, difficulty });
    await course.save();
    res.status(201).json({ message: "Course added", course });
  } catch (err) {
    res.status(500).json({ message: "Error adding course", error: err });
  }
};

exports.addTopic = async (req, res) => {
  const { courseId, title, content, difficulty } = req.body;
  try {
    const topic = new Topic({ courseId, title, content, difficulty });
    await topic.save();
    await Course.findByIdAndUpdate(courseId, { $push: { topics: topic._id } });
    res.status(201).json({ message: "Topic added", topic });
  } catch (err) {
    res.status(500).json({ message: "Error adding topic", error: err });
  }
};
exports.addBulkTopic = async (req, res) => {
  const { courseId, topics } = req.body;

  if (!courseId || !Array.isArray(topics) || topics.length === 0) {
    return res
      .status(400)
      .json({ message: "Course ID and topics array are required." });
  }

  const isValid = topics.every((t) => t.title && t.content && t.difficulty);

  if (!isValid) {
    return res.status(400).json({
      message: "Each topic must have title, content, and difficulty.",
    });
  }

  try {
    const topicsWithCourseId = topics.map((topic) => ({
      ...topic,
      courseId,
    }));

    const createdTopics = await Topic.insertMany(topicsWithCourseId);
    const topicIds = createdTopics.map((topic) => topic._id);

    await Course.findByIdAndUpdate(courseId, {
      $push: { topics: { $each: topicIds } },
    });

    res.status(201).json({
      message: "Bulk topics added successfully",
      topics: createdTopics,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding bulk topics",
      error: error.message,
    });
  }
};

exports.addQuestion = async (req, res) => {
  const { topicId, questionText, options, correctAnswer, difficulty } =
    req.body;
  try {
    const question = new Question({
      topicId,
      questionText,
      options,
      correctAnswer,
      difficulty,
    });
    await question.save();
    await Topic.findByIdAndUpdate(topicId, {
      $push: { questions: question._id },
    });
    res.status(201).json({ message: "Question added", question });
  } catch (err) {
    res.status(500).json({ message: "Error adding question", error: err });
  }
};
exports.addMultipleQuestions = async (req, res) => {
  const { topicId, questions } = req.body;

  if (!Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ message: "Questions array is required" });
  }

  try {
    const questionDocs = questions.map((q) => ({
      topicId,
      questionText: q.questionText,
      options: q.options,
      correctAnswer: q.correctAnswer,
      difficulty: q.difficulty || "easy", // default if not passed
    }));

    const insertedQuestions = await Question.insertMany(questionDocs);
    const questionIds = insertedQuestions.map((q) => q._id);

    await Topic.findByIdAndUpdate(topicId, {
      $push: { questions: { $each: questionIds } },
    });

    res.status(201).json({
      message: "Questions added successfully",
      addedCount: insertedQuestions.length,
      questions: insertedQuestions,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error adding multiple questions", error: err });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", role = "" } = req.query;

    const query = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    };

    if (role === "all") {
      delete query.role;
    } else if (role) {
      query.role = role;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [users, total] = await Promise.all([
      User.find(query, "name email imageUrl role")
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 }),
      User.countDocuments(query),
    ]);

    res.status(200).json({
      users,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", error: err });
  }
};
