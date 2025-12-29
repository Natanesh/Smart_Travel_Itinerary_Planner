import { Request, Response } from "express";

export const createItinerary = async (req: Request, res: Response) => {
  try {
    const { destination, start_date, end_date, budget } = req.body;

    // TODO: Save to DB (example response)
    const newItinerary = {
      id: Date.now(),
      destination,
      start_date,
      end_date,
      budget,
    };

    res.status(201).json({
      message: "Itinerary created",
      itinerary: newItinerary,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating itinerary" });
  }
};
