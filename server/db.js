import dotenv from "dotenv";
dotenv.config(); // make sure it's called before accessing process.env
import pkg from "pg";
const { Pool } = pkg;
console.log("Connecting to DB with URL:", process.env.DATABASE_URL);
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default pool;
