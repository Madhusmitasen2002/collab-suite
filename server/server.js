import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js"; 
import workspaceRoutes from "./routes/workspace.js";

dotenv.config();
console.log("Loaded DATABASE_URL:", process.env.DATABASE_URL);
const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:5173",
  "https://collab-suite.vercel.app",
  "https://collab-suite-4ek412jef-madhusmita-sen-s-projects.vercel.app",
  "https://collab-suite-weld.vercel.app", // your actual deploy
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Backend is Running!' });
});

app.use("/auth", authRoutes);

// generic error logger (to see stack traces)
app.use((err, req, res, next) => {
  console.error("Unhandled server error:", err.stack || err);
  res.status(500).json({ error: "Server error" });
});
app.use("/workspace", workspaceRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
