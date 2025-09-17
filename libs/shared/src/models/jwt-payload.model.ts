import { Role } from "../prisma/enhance/enums";

export interface JwtPayload {
  user:{
    userId: string;
    role: Role;
    ip: string;
    userAgent: string;
    vendorSlugs:string[];  
  }
}