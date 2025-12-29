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

// Debug endpoint to check all itineraries in database
app.get("/debug/itineraries", async (req, res) => {
  try {
    const [rows]: any = await pool.query(
      "SELECT id, user_id, destination, start_date, end_date, budget, created_at FROM itineraries ORDER BY id"
    );
    return res.json({ count: rows.length, itineraries: rows });
  } catch (err: any) {
    console.error("debug/itineraries error", err);
    return res.status(500).json({ message: err?.message || "Server error" });
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
