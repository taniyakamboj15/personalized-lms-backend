const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "Name can be min of 3 char"],
      maxlength: [50, "Name can be max of 50 char"],
    },
    email: {
      type: String,
      required: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    photoUrl: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png",
      trim: true,
      match: [/^https?:\/\/.+/i, "Please provide a valid image URL"],
    },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["student", "admin", "tutor"],
    },
    xp: { type: Number, default: 0 },
    lastLogin: { type: Date, default: null },
    streak: { type: Number, default: 0 },
  },

  { timestamps: true }
);
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
