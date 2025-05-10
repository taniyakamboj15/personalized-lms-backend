const adminauth = (req, res, next) => {
  const { role } = req.user;
  if (role !== "admin") {
    return res.status(403).json({ msg: "Access denied" });
  }
  next();
};

const tutorauth = (req, res, next) => {
  const { role } = req.user;
  if (role !== "admin" && role !== "tutor") {
    return res.status(403).json({ msg: "Access denied" });
  }
  next();
};

module.exports = { adminauth, tutorauth };
