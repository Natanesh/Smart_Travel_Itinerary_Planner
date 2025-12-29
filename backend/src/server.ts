import app from "./routes/routes";
import dotenv from "dotenv";
import pool, { initDB } from "./config/db";
dotenv.config();
const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
  try {
    console.log(`Server running on port ${PORT}`);
  } catch (err) {
    console.log(err);
  }
});

// app.get("/debug/users", async (req, res) => {
//   try {
//     const [rows]: any = await pool.query(
//       "SELECT id, name, email, role, phone_number, state, created_at FROM users"
//     );
//     return res.json(rows);
//   } catch (err: any) {
//     console.error("debug/users error", err);
//     return res.status(500).json({ message: err?.message || "Server error" });
//   }
// });

const start = async () => {
  try {
    await initDB();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

start();
