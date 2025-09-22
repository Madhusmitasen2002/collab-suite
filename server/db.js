import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // from Supabase Project Settings
  ssl: { rejectUnauthorized: false }, // needed for Supabase cloud
});

export default pool;
