import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = [
  "http://localhost:5173",          // Vite dev server
  "https://collab-suite.vercel.app" // deployed frontend
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed for: " + origin));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.get('/', (req, res) => {
  res.json({message: 'Backend is Running!'});
});
app.use("/auth", authRoutes)
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});