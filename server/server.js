import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// Routes
import authRoutes from "./routes/auth.js";
import workspaceRoutes from "./routes/workspace.js";
import taskRoutes from "./routes/tasks.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Allowed Origins for CORS
const allowedOrigins = [
  "http://localhost:5173",
  "https://collab-suite.vercel.app",
  "https://collab-suite-ajqw588yb-madhusmita-sen-s-projects.vercel.app",
  "https://collab-suite-weld.vercel.app"
];

// ✅ CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // allow request
    } else {
      callback(new Error("Not allowed by CORS: " + origin)); // block request
    }
  },
  credentials: true // allow cookies, authorization headers, etc.
};

// ✅ Middleware
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

// ✅ Health Check Route
app.get("/", (req, res) => {
  res.json({ message: "✅ Backend is Running!" });
});

// ✅ API Routes
app.use("/auth", authRoutes);
app.use("/workspace", workspaceRoutes);
app.use("/tasks", taskRoutes);

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Unhandled server error:", err.stack || err.message);
  res.status(500).json({ error: "Internal Server Error" });
});

// ✅ Start the Server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
