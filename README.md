# 📚 EduDev Backend API

This is the backend API for **EduDev**, a personalized learning management system (LMS) built using **Node.js**, **Express.js**, **MongoDB**, **Redis**, **OAuth**, **Firebase Authentication**, **Nodemailer**, and **Cookies**. The system supports features like user authentication, course management, dynamic difficulty-based progress tracking, and feedback collection.

---

## 🚀 Features

- 🔐 **JWT-based Authentication** (Login/Register)
- 🍪 **Cookie-based Token Storage** for Secure Auth Sessions
- 🔑 **OAuth Integration** for Google Sign-In
- 📘 **Course, Topic, and Question Management** (Admin)
- 📈 **User Progress Tracking** with Dynamic Difficulty
- 🧠 **Redis Integration** for Caching & Performance
- 📧 **Email OTP Verification** for New User Signup
- 💬 **Feedback Submission & View**
- 🧪 **Rate Limiting** to Prevent Abuse
- 🌐 **CORS Configuration** for Secure Frontend Integration
- 📂 **Modular Route Structure** for Better Maintainability

---

## 🛠️ Tech Stack

- **Node.js + Express.js** — Backend Framework
- **MongoDB + Mongoose** — Database
- **Redis** — Caching / Performance Optimization
- **OAuth** — Authentication via Google
- **Firebase** — Firebase Authentication
- **Cookies** — Secure Token Management
- **Nodemailer** — Email Sending for OTP
- **dotenv** — Environment Variable Management
- **Rate Limiter** — Basic DDoS Protection
- **CORS** — Secure Cross-Origin Requests

---

## 📁 Project Structure

```

📦 
.gitignore
README.md
├─ package-lock.json
├─ package.json
├─ server.js
├─ server
│  ├─ config
dbConfig.js
email.js
│  │  └─ firebase.js
│  ├─ controller
adminController.js
authController.js
progressController.js
│  │  └─ userController.js
│  ├─ middleware
adminmiddleware.js
authmiddleware.js
│  │  ├─ handleValidationErrors.js
│  │  ├─ validateAdmin.js
│  │  └─ validateUserSignup.js
│  ├─ models
│  │  ├─ CourseSchema.js
│  │  ├─ FeedBack.js
│  │  ├─ QuestionSchema.js
TopicSchema.js
UserProgressSchema.js
│  │  └─ UserSchema.js
│  ├─ routes
adminRoutes.js
authRoutes.js
courseRoutes.js
feedBackRoutes.js
progressRoutes.js
questionRoutes.js
topicRoutes.js
│  │  └─ userRoutes.js
│  └─ utils
│     ├─ generateOtp.js
│     ├─ getNextDifficulty.js
│     ├─ recommendNextTopic.js
│     └─ redisClient.js
└─ vercel.json
```

---

## ⚙️ Installation

1. **Clone the repository:**

```bash
git clone https://github.com/yourusername/eduDev-backend.git
cd eduDev-backend
```

2. **Install the dependencies:**

```bash
npm install
```

3. **Create a ****************`.env`**************** file and add the following variables:**

```env
PORT=5000
MONGO_URI=your_mongo_connection_string
REDIS_URL=your_redis_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
FIREBASE_API_KEY=your_firebase_api_key
```

4. **Run the server:**

```bash
npm start
```

The backend API will be running on [http://localhost:5000](http://localhost:5000).

---

## 🚨 API Routes

### 🔐 Auth Routes

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/sendOtp` - Send OTP for email verification *(uses Redis to store OTP for 5 minutes)*
- `POST /api/auth/verifyOtp` - Verify OTP for email verification *(reads & clears OTP from Redis)*
- `POST /api/auth/login` - Login with email and password (sets cookie)
- `POST /api/auth/firebaseLogin` - Login with Firebase (sets cookie)
- `POST /api/auth/logout` - Logout the user (clears cookie)

### 👤 User Routes (Protected)

- `GET /api/user/profile` - Get user profile details
- `PUT /api/user/update-profile` - Update user profile details
- `PUT /api/user/update-password` - Update password
- `DELETE /api/user/delete` - Delete user account
- `GET /api/user/dashboard` - Get user dashboard info

### 📈 Progress Routes (Protected)

- `POST /api/progress/initialize` - Initialize user progress for a course
- `PUT /api/progress/update` - Update user progress after solving a question
- `GET /api/progress/:courseId` - Get current progress for a course
- `GET /api/progress/:courseId/nextTopic` - Get the next topic based on progress

### 🧑‍🏫 Admin Routes (Protected)

- `POST /api/admin/add-course` - Add a new course
- `POST /api/admin/add-topic` - Add a new topic
- `POST /api/admin/add-question` - Add a new question
- `GET /api/admin/users` - View all users

### 💬 Feedback Routes

- `POST /api/feedback` - Submit feedback
- `GET /api/feedback` - View all submitted feedback

### 🎓 Student Dashboard Routes (Protected)

- `GET /api/dashboard/user-progress` — Get user's overall progress across all enrolled courses
- `GET /api/dashboard/course-progress/:courseId` — Get topic-wise progress for a specific course
- `GET /api/dashboard/level` — Get user's current level and stats based on performance
- `GET /api/dashboard/completed-courses` — Get a list of completed courses
- `GET /api/dashboard/in-progress-courses` — Get a list of currently enrolled (but incomplete) courses

---

## 🛡️ Security and Features

### 1. Rate Limiting

Prevents abuse with a limit of 200 requests per hour per user.

### 2. Email OTP Verification

Uses Nodemailer to send OTPs (valid for 5 minutes) during registration.

- OTP is generated and stored in Redis with key: `otp:<user_email>`
- Expires in 5 minutes (300 seconds)
- Verified and deleted from Redis once confirmed by user

### 3. OAuth and Firebase Authentication

Allows secure login via Google OAuth or Firebase Auth.

### 4. Cookie-Based Auth Tokens

Stores JWT tokens in **HTTP-only cookies** to enhance security and prevent XSS.

### 5. CORS Support

Ensures secure access from frontend domains in both dev and prod.

### 6. Dynamic Difficulty

User progress determines next topics and difficulty level dynamically.

### 7. Feedback Submission

Users can submit feedback only once via email validation.

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact

For more information or queries, feel free to reach out:

📧 **[taniyakamboj15@gmail.com](mailto\:taniyakamboj15@gmail.com)**

