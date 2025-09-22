import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5713';

app.use(cors({
  origin: CLIENT_URL,
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