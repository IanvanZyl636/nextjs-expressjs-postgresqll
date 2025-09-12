import { Role } from "../prisma/enhance/enums";

export interface JwtPayload {
  userId: string;
  role: Role;
  ip: string;
  userAgent: string;
}