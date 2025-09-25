import dotenv from "dotenv";
dotenv.config();
import pkg from "pg";
const { Pool } = pkg;

console.log("Connecting to DB with URL:", process.env.DATABASE_URL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true, // Ensure SSL is required
    rejectUnauthorized: false, // Accept Supabase’s self-signed cert
  },
  host: "db.zwyafaukgvnretgglykx.supabase.co", // Force correct DNS resolution
});

export default pool;
