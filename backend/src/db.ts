import mysql, { Pool } from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const pool: Pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

export default pool;
