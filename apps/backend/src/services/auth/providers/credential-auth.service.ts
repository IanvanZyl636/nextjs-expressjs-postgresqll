
import bcrypt from 'bcrypt';
import { prisma } from '../../../integrations/prisma';
import { AuthResult, CredentialInput, RegisterResult } from '@nextjs-expressjs-postgresql/shared';
import { generateJwt } from '../auth.util';
import HttpError from '../../../utils/error/http-error';

export async function loginWithCredentials(input: CredentialInput): Promise<AuthResult> {
  const user = await prisma.user.findUnique({ where: { email: input.email } });

  if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) {
    throw new HttpError(401, 'Invalid credentials');
  }

  const token = generateJwt(user);

  return { token, user };
};

export async function registerCredentials(input: CredentialInput): Promise<RegisterResult>{
    const existingUser = await prisma.user.findFirst({
        where: { email: input.email }
    })

    if (existingUser) throw new HttpError(409, 'User already exists');
    
    const passwordHash = await bcrypt.hash(input.password, 10)

    const user = await prisma.user.create({
        data: {
            email:input.email,
            passwordHash,
        },
    });

    return {
        email:user.email
    };
}