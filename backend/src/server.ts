import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { userRegistration } from "./authentication/register";
import { userLogin } from "./authentication/login";
import pool, { initDB } from "./config/db";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.post("/register", userRegistration);
app.post("/login", userLogin);

app.get('/debug/users', async (req, res) => {
  try {
    const [rows]: any = await pool.query(
      'SELECT id, name, email, role, phone_number, state, created_at FROM users'
    );
    return res.json(rows);
  } catch (err: any) {
    console.error('debug/users error', err);
    return res.status(500).json({ message: err?.message || 'Server error' });
  }
});

const start = async () => {
  try {
    await initDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Server failed to start due to DB error", err);
    process.exit(1);
  }
};

start();
