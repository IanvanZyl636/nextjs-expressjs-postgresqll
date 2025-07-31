import { prisma } from "../../integrations/prisma";
import HttpError from "../../utils/error/http-error";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Prisma } from "@nextjs-expressjs-postgresql/shared";

export async function credentialLogin(email:string, password:string){
    const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: email },       
      ]
    }
  })

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) throw new HttpError(401, 'Invalid credentials');

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' })

  return { token, user: { email: user.email } };
}

export function generateJwt(user:Prisma.UserModel){
    return jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
}