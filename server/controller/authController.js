const User = require("../models/UserSchema");
const jwt = require("jsonwebtoken");
const admin = require("../config/firebase");
const transporter = require("../config/email");
const redisClient = require("../utils/redisClient");
const generateOTP = require("../utils/generateOtp");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

exports.register = async (req, res) => {
  const { name, email, photoUrl, password, role } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ msg: "Email already in use" });
    const userStreak = 1;
    const user = await User.create({
      name,
      email,
      photoUrl,
      password,
      role,
      streak: userStreak,
    });
    const token = generateToken(user._id);
    res.cookie("token", token, {
  path: "/",
  httpOnly: true,
  secure: true,            
  sameSite: "None"         
});
    const { password: _, ...userWithoutPassword } = user._doc;
    res
      .status(201)
      .json({ message: "Sign Up Successfully", data: userWithoutPassword });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.sendOtp = async (req, res) => {
  const { email } = req.body;
  const otp = generateOTP();
  const normalizedEmail = email.trim().toLowerCase();

  try {
    const user = await User.findOne({ email: normalizedEmail });
    if (user) {
      return res.status(400).json({ msg: "Email already exists" });
    }
    await redisClient.set(`otp:${normalizedEmail}`, otp, { EX: 300 });
    // console.log("Sending OTP to email:", normalizedEmail);
    // console.log("Generated OTP:", otp);

    await transporter.sendMail({
      from: `EduVibe <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your One-Time Password (OTP)",
      html: `
        <div style="max-width: 600px; margin: auto; padding: 24px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #333333;">Email Verification</h2>
          <p style="font-size: 16px; color: #555555;">Hi there,</p>
          <p style="font-size: 16px; color: #555555;">
            To verify your email address, please use the following One-Time Password (OTP):
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="display: inline-block; padding: 14px 28px; font-size: 22px; font-weight: bold; background-color: #007bff; color: #ffffff; border-radius: 6px;">
              ${otp}
            </span>
          </div>
          <p style="font-size: 16px; color: #555555;">
            This OTP is valid for <strong>5 minutes</strong>. Please do not share it with anyone for security reasons.
          </p>
          <p style="font-size: 14px; color: #999999;">If you didn’t request this, you can safely ignore this email.</p>
          <br/>
          <p style="font-size: 16px; color: #333333;">Best regards,<br/>The EduVibe Team</p>
        </div>
      `,
    });

    res.status(200).json({ msg: "OTP sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to send OTP" });
  }
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const normalizedEmail = email.trim().toLowerCase(); // Normalize

  try {
    const storedOtp = await redisClient.get(`otp:${normalizedEmail}`);
    // console.log("Stored OTP:", storedOtp);
    // console.log("Received OTP:", otp);

    if (!storedOtp) {
      return res.status(400).json({ msg: "OTP expired or not found" });
    }

    if (storedOtp.trim() !== otp.trim()) {
      return res.status(400).json({ msg: "Invalid OTP" });
    }

    await redisClient.del(`otp:${normalizedEmail}`);

    res.status(200).json({ success: true, msg: "OTP verified successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password)
      return res.status(400).json({ msg: "Please enter all fields" });
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });
    const today = new Date();

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const lastLogin = user.lastLogin || new Date(0);
    const lastLoginDate = new Date(lastLogin.toDateString());

    if (lastLoginDate.toDateString() === yesterday.toDateString()) {
      user.streak += 1;
    } else if (lastLoginDate.toDateString() !== today.toDateString()) {
      user.streak = 1;
    }

    user.lastLogin = today;

    await user.save();
    const token = generateToken(user._id);
    res.cookie("token", token, {
  path: "/",
  httpOnly: true,
  secure: true,            
  sameSite: "None"         
});

    const { password: _, ...userWithoutPassword } = user._doc;
    res
      .status(201)
      .json({ msg: "Log in Successfull", data: userWithoutPassword });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.firebaseLogin = async (req, res) => {
  const { token } = req.body;
  console.log("Received Firebase Token:", token);

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log("Decoded Token:", decodedToken);
    const { email, name, uid, picture } = decodedToken;
    if (!email) return res.status(400).json({ msg: "Invalid credentials" });
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name: name || "Google User",
        photoUrl: picture,
        email,
        password: uid,
        role: "student",
      });
    }
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const lastLogin = user.lastLogin || new Date(0);
    const lastLoginDate = new Date(lastLogin.toDateString());

    if (lastLoginDate.toDateString() === yesterday.toDateString()) {
      user.streak += 1;
    } else if (lastLoginDate.toDateString() !== today.toDateString()) {
      user.streak = 1;
    }

    user.lastLogin = today;

    await user.save();

    const appToken = generateToken(user._id);

    res.cookie("token", appToken, {
  path: "/",
  httpOnly: true,
  secure: true,            // ✅ Required for HTTPS
  sameSite: "None"         // ✅ Required for cross-origin request
});

    res.status(201).json({ msg: "Login Successfull ", data: user });
  } catch (err) {
    console.error(err);
    res.status(401).json({ msg: "Invalid Firebase token" });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token", { path: "/" });
  res.json({ msg: "Logged out successfully" });
};
