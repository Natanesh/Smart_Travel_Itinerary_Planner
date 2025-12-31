import { Request, Response } from "express";
import { pool } from "../config/db";

export async function createItinerary(req: Request, res: Response) {
  try {
    const {
      user_id,
      destination,
      start_date,
      end_date,
      budget,
      activities,
      notes,
      media_paths,
    } = req.body;

    if (
      !user_id ||
      !destination ||
      !start_date ||
      !end_date ||
      !budget ||
      !activities
    ) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const query = `
      INSERT INTO itineraries
      (user_id, destination, start_date, end_date, budget, activities, notes, media_paths)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      user_id,
      destination,
      start_date,
      end_date,
      budget,
      JSON.stringify(activities),
      notes ?? null,
      media_paths ?? null,
    ];

    const [result] = await pool.execute(query, values);

    res.status(201).json({
      message: "Itinerary stored successfully",
      result,
    });
  } catch (error) {
    console.error(" DB Error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
}
