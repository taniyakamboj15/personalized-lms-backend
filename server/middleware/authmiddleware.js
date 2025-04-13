const jwt = require("jsonwebtoken");
const User = require("../models/UserSchema");

const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ msg: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) return res.status(401).json({ msg: "User Not Found" });

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid Token" });
  }
};
module.exports = userAuth;
