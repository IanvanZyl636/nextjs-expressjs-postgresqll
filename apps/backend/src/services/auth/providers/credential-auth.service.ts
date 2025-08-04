
import bcrypt from 'bcrypt';
import { prisma } from '../../../integrations/prisma';
import { AuthResult, CredentialInput, RegisterResult } from '@nextjs-expressjs-postgresql/shared';
import HttpError from '../../../utils/error/http-error';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.util';


export async function loginWithCredentials(input: CredentialInput): Promise<AuthResult> {
  const user = await prisma.user.findUnique({ where: { email: input.email } });

  if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) {
    throw new HttpError(401, 'Invalid credentials');
  }

  const accessToken = generateAccessToken({userId: user.id, ip: input.ip, userAgent: input.userAgent});
  const refreshToken = generateRefreshToken({userId: user.id, ip: input.ip, userAgent: input.userAgent});

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      ip: input.ip,
      userAgent: input.userAgent,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    }
  });

  return { accessToken, refreshToken, user: { email: user.email } };
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