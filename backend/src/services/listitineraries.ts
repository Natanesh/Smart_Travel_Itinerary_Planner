import { Request, Response } from "express";
import pool from "../config/db";
export async function getItineraries(req: Request, res: Response) {
  const [rows]: any = await pool.query(
    "SELECT id,user_id,destination,start_date,end_date,budget FROM itineraries WHERE user_id = ?",
    [req.cookies.id]
  );
  res.json(rows);
}
export async function getItinerary(req: Request, res: Response) {
  const [rows]: any = await pool.query(
    "SELECT i.id,i.user_id,i.destination,i.start_date,i.end_date,i.budget,i.activities,i.created_at,u.name,u.contact_info FROM users u JOIN itineraries i ON u.id=i.user_id WHERE i.id = ? and i.user_id = ?",
    [req.params.id, req.params.user_id]
  );
  res.json(rows);
}
