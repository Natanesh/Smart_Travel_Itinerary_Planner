import { Request, Response } from "express";
import pool from "../config/db";
import bcrypt from "bcryptjs";

export async function userRegistration(req: Request, res: Response) {
  try {
    const { name, email, password, phone_number, state } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "name, email and password required" });
    }

    const [rows]: any = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );
    if (Array.isArray(rows) && rows.length > 0) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const contactInfo = JSON.stringify({ phone_number, state });

    const [result]: any = await pool.query(
      `INSERT INTO users (name, email, password, role, contact_info) VALUES (?, ?, ?, 'Traveler', ?)`,
      [name, email, hash, contactInfo]
    );

    return res.status(201).json({ id: result.insertId, email });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}
