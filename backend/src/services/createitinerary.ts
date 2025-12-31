import { Request, Response } from "express";
export async function createItinerary(req: Request, res: Response) {
  console.log(req.body);
}
