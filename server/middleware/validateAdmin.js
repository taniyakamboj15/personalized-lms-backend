const { body } = require("express-validator");

exports.validateCourse = [
  body("title").notEmpty().withMessage("Course title is required"),
  body("description").notEmpty().withMessage("Course description is required"),
  body("difficulty")
    .isIn(["easy", "medium", "hard"])
    .withMessage("Invalid difficulty level"),
];

exports.validateTopic = [
  body("courseId").notEmpty().withMessage("Course ID is required"),
  body("title").notEmpty().withMessage("Topic title is required"),
  body("content").notEmpty().withMessage("Topic content is required"),
  body("difficulty")
    .isIn(["easy", "medium", "hard"])
    .withMessage("Invalid difficulty level"),
];

exports.validateQuestion = [
  body("topicId").notEmpty().withMessage("Topic ID is required"),
  body("questionText").notEmpty().withMessage("Question text is required"),
  body("options")
    .isArray({ min: 2 })
    .withMessage("Options must be an array with at least 2 options"),
  body("correctAnswer").notEmpty().withMessage("Correct answer is required"),
  body("difficulty")
    .isIn(["easy", "medium", "hard"])
    .withMessage("Invalid difficulty level"),
];
