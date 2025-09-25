import dotenv from "dotenv";
dotenv.config();
import pkg from "pg";
const { Pool } = pkg;

console.log("Connecting to DB with URL:", process.env.DATABASE_URL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
    rejectUnauthorized: false,
  },
});

export default pool;
