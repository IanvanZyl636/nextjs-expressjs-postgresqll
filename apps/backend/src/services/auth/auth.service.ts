import { prisma } from "../../integrations/prisma";
import bcrypt from 'bcrypt';
import HttpError from "../../utils/error/http-error";
import jwt from 'jsonwebtoken';

const email = 'vanzyli101@gmail.com';
const password = 'password';

export async function registerUser() {  
    const existingUser = await prisma.user.findFirst({
        where: { email }
    })

    if (existingUser) throw new HttpError(409, 'User already exists');
    
    const passwordHash = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
        data: {
            email,
            passwordHash,
        },
    });

    return user;
}

export async function loginUser() {
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