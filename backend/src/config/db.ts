import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "smart_travel",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function initDB(): Promise<void> {
  try {
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    console.log(
      `MySQL connected to ${process.env.DB_HOST || "localhost"}:$${
        process.env.DB_PORT || 3306
      }/${process.env.DB_NAME || "smart_travel"}`
    );
  } catch (err) {
    console.error("Unable to connect to MySQL:", err);
    throw err;
  }
}

export default pool;
