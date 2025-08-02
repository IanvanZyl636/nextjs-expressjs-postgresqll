import { AuthenticatedRequest } from "../../models/authenticated-request.model";
import { Response } from "express";

export const getUser = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  return res.json({ userId: true });
};