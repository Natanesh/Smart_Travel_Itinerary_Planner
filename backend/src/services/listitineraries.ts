import { Request, Response } from "express";
import pool from "../config/db";
export async function getItineraries(req: Request, res: Response) {
  const [rows]: any = await pool.query(
    `
    SELECT
      id,
      user_id,
      destination,
      DATE_FORMAT(start_date, '%Y-%m-%d') AS start_date,
      DATE_FORMAT(end_date, '%Y-%m-%d') AS end_date,
      budget
    FROM itineraries
    WHERE user_id = ?
    `,
    [req.cookies.id]
  );

  res.json(rows);
}

export async function getItinerary(req: Request, res: Response) {
  const [rows]: any = await pool.query(
    `
    SELECT 
      i.id,
      i.user_id,
      i.destination,
      DATE_FORMAT(i.start_date, '%Y-%m-%d') AS start_date,
      DATE_FORMAT(i.end_date, '%Y-%m-%d') AS end_date,
      i.budget,
      i.activities,
      DATE_FORMAT(i.created_at, '%Y-%m-%d') AS created_at,
      u.name,
      u.contact_info
    FROM users u
    JOIN itineraries i ON u.id = i.user_id
    WHERE i.id = ? AND i.user_id = ?
    `,
    [req.params.id, req.params.user_id]
  );

  res.json(rows);
}
export async function deleteItinerary(req: Request, res: Response) {
  try {
    const itineraryId = req.params.id;
    const userId = req.cookies.id;

    console.log(
      `[DELETE] Attempting to delete itinerary ID: ${itineraryId} for user ID: ${userId}`
    );

    const [checkRows]: any = await pool.query(
      "SELECT id, destination FROM itineraries WHERE id = ? AND user_id = ?",
      [itineraryId, userId]
    );

    if (checkRows.length === 0) {
      console.log(
        `[DELETE] Itinerary ${itineraryId} not found or unauthorized for user ${userId}`
      );
      return res
        .status(404)
        .json({ error: "Itinerary not found or unauthorized" });
    }

    console.log(
      `[DELETE] Found itinerary: ${checkRows[0].destination} (ID: ${checkRows[0].id})`
    );

    // Delete the itinerary
    const [result]: any = await pool.query(
      "DELETE FROM itineraries WHERE id = ? AND user_id = ?",
      [itineraryId, userId]
    );

    console.log(
      `[DELETE] Successfully deleted itinerary ID: ${itineraryId}. Affected rows: ${result.affectedRows}`
    );
    res.json({
      message: "Itinerary deleted successfully",
      deletedId: itineraryId,
    });
  } catch (error) {
    console.error("[DELETE] Error deleting itinerary:", error);
    res.status(500).json({ error: "Failed to delete itinerary" });
  }
}
