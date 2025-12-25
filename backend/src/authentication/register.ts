import { Request, Response } from "express";
export function userRegistration(req: Request, res: Response) {
  console.log(req.body);
  res.end();
}
