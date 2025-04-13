const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: { type: String, required: true },
  imageUrl: {
    type: String,
    default:
      "https://blogassets.leverageedu.com/blog/wp-content/uploads/2020/05/23151218/BA-Courses.png",
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    default: "easy",
  },
  topics: [{ type: mongoose.Schema.Types.ObjectId, ref: "Topic" }],
});

module.exports = mongoose.model("Course", courseSchema);
