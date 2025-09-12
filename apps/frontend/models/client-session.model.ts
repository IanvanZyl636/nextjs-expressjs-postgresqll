import { Role } from "@nextjs-expressjs-postgresql/shared/prisma/enhance/enums";

export interface ClientSession{
    userId: string;
    role: Role;
}