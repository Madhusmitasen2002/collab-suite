import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

app.use(cors({
  origin: CLIENT_URL,
  credentials: true,   
}));

app.use(express.json());
app.get('/', (req, res) => {
  res.json({message: 'Backend is Running!'});
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});