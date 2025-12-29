import { Request, Response } from "express";
export function autoLogin(req: Request, res: Response) {
  res.json({ id: req.cookies.id });
}
