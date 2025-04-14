// controllers/userController.js
const UserProgress = require("../models/UserProgressSchema");
const User = require("../models/UserSchema");
const validator = require("validator");
exports.getUserProfile = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(404).json({ msg: "User not found" });
    res
      .status(200)
      .json({ msg: "User profile fetched successfully", data: user });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
exports.updateUserProfile = async (req, res) => {
  const user = req.user;
  const { name, email, photoUrl } = req.body;
  try {
    if (!name || !email)
      return res.status(400).json({ msg: "All fields are required" });
    user.name = name;
    user.email = email;
    user.photoUrl = photoUrl || user.photoUrl;
    await user.save();
    res.status(200).json({ msg: "Profile updated successfully", data: user });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
exports.updateUserPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ msg: "All fields are required" });
    }
    if (!validator.isStrongPassword(newPassword)) {
      return res.status(400).json({ msg: "Password is not strong enough" });
    }
    // console.log("Updating password for user:", req.user.id);
    // console.log("Current Password:", currentPassword);
    // console.log("new password:", newPassword);
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ msg: "User not found" });

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ msg: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ msg: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
exports.deleteUserAccount = async (req, res) => {
  const user = req.user;
  try {
    await user.remove();
    res.status(200).json({ msg: "Account deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
exports.getUserDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    const progresses = await UserProgress.find({ userId })
      .populate("courseId")
      .populate("completedTopics");
    const user = await User.findById(userId);

    const dashboard = progresses.map((progress) => {
      const totalTopics = progress.courseId.topics.length;
      const completedCount = progress.completedTopics.length;
      const progressPercent = (completedCount / totalTopics) * 100;

      const correctAnswers =
        progress.performance.easy.correct +
        progress.performance.medium.correct +
        progress.performance.hard.correct;

      return {
        courseId: progress.courseId._id,
        title: progress.courseId.title,
        imageUrl: progress.courseId.imageUrl,
        difficulty: progress.courseId.difficulty,
        totalTopics,
        completedCount,
        progressPercent,
        status: completedCount === totalTopics ? "Completed" : "In Progress",
        correctAnswers,
      };
    });

    const totalCorrect = dashboard.reduce(
      (acc, item) => acc + item.correctAnswers,
      0
    );
    let level = Math.floor(totalCorrect / 4);
    if (level > 2) {
      level = Math.floor(totalCorrect / 8);
    } else if (level > 4) {
      level = Math.floor(totalCorrect / 10);
    } else if (level > 6) {
      level = Math.floor(totalCorrect / 14);
    } else if (level > 8) {
      level = Math.floor(totalCorrect / 18);
    } else if (level > 12) {
      level = Math.floor(totalCorrect / 24);
    }

    res
      .status(200)
      .json({ dashboard, level, xp: user.xp, streak: user.streak });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err });
  }
};
