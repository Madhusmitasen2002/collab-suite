import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js"; // adjust path if needed

dotenv.config();
console.log("Loaded DATABASE_URL:", process.env.DATABASE_URL);
const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:5173",            // local dev (vite)
  "https://collab-suite.vercel.app",  // your deployed frontend
  // add other origins if needed
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like Postman / server-to-server)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed for: " + origin));
    }
  },
  credentials: true // <-- IMPORTANT, allow cookies to be sent/received
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
