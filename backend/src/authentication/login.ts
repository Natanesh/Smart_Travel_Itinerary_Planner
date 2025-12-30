import { Request, Response } from "express";
import pool from "../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "replace_this_with_a_strong_secret";

export async function userLogin(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    console.log("/login payload:", {
      email,
      password: password ? "***" : undefined,
    });
    if (!email || !password) {
      return res.status(400).json({ message: "email and password required" });
    }

    const [rows]: any = await pool.query(
      "SELECT id, name, email, password, role FROM users WHERE email = ?",
      [email]
    );
    console.log(
      "/login db rows:",
      rows && rows.length ? { id: rows[0].id, email: rows[0].email } : rows
    );
    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    console.log("/login password match:", match);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });
    else {
      res.cookie("id", "" + user.id, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
    }

    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

    return res.json({ token, user: payload });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}
export function userLogout(req: Request, res: Response) {
  res.clearCookie("id", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  res.json("Logout Successfully!");
}
