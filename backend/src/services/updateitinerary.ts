import { Request, Response } from "express";
import { pool } from "../config/db";

export async function updateItinerary(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const { destination, start_date, end_date, budget, activities } = req.body;

    if (
      !id ||
      !destination ||
      !start_date ||
      !end_date ||
      !budget ||
      !activities
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const query = `
  UPDATE itineraries
  SET
    destination = ?,
    start_date = ?,
    end_date = ?,
    budget = ?,
    activities = ?
  WHERE id = ?
`;

    const values = [
      destination,
      start_date,
      end_date,
      budget,
      JSON.stringify(activities), // IMPORTANT
      id,
    ];

    const [result]: any = await pool.execute(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    res.status(200).json({
      message: "Itinerary updated successfully",
    });
  } catch (error) {
    console.error("Update itinerary error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
