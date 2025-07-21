const express = require("express");
const connectDB = require("./server/config/dbConfig");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

require("dotenv").config();
const authRoutes = require("./server/routes/authRoutes");
const userRoutes = require("./server/routes/userRoutes");
const progressRoutes = require("./server/routes/progressRoutes");
const adminRoutes = require("./server/routes/adminRoutes");
const topicRoutes = require("./server/routes/topicRoutes");
const courseRoutes = require("./server/routes/courseRoutes");
const questionRoutes = require("./server/routes/questionRoutes");
const rateLimit = require("express-rate-limit");
const feedBackRoutes = require("./server/routes/feedBackRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration
const limiter = rateLimit({
  max: 200,
  windowMs: 60 * 60 * 1000,
  message: "Too many request from this IP! Please Try again in an hour",
});

const allowedOrigins = [
  "http://localhost:5173", // Development Origin
  "https://edudev.taniyakamboj.info",
  "https://edudev.abhinavranjan.me"
  // Production Origin
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use("/", limiter);
app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/topic", topicRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/feedback", feedBackRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello Edu Vibe Server Is Running" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server Connected Successfully on PORT:", PORT);
    });
  })
  .catch((err) => {
    console.log("Error in connecting database", err);
    process.exit(1);
  });
