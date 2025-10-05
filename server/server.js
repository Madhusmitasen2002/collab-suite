import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// Routes
import authRoutes from "./routes/auth.js";
import workspaceRoutes from "./routes/workspace.js";
import taskRoutes from "./routes/tasks.js";

// Initialize environment variables
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS Allowed Origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://collab-suite.vercel.app",
  "https://collab-suite-ajqw588yb-madhusmita-sen-s-projects.vercel.app",
  "https://collab-suite-weld.vercel.app"
];

// ✅ CORS Middleware (allow cookies & dynamic origin)
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin); // allow
    } else {
      callback(new Error("Not allowed by CORS: " + origin)); // deny
    }
  },
  credentials: true
}));

// ✅ Handle Preflight Requests
app.options("*", cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin);
    } else {
      callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  credentials: true
}));

// ✅ Middlewares
app.use(cookieParser());
app.use(express.json());

// ✅ Health check route
app.get("/", (req, res) => {
  res.json({ message: "✅ Backend is Running!" });
});

// ✅ Register Routes
app.use("/auth", authRoutes);
app.use("/workspace", workspaceRoutes);
app.use("/tasks", taskRoutes);

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Unhandled server error:", err.stack || err.message);
  res.status(500).json({ error: "Internal Server Error" });
});

// ✅ Start Server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
