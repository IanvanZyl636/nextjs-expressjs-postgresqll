import HttpError from "../../utils/error/http-error";
import {AuthProvider, AuthResult, CredentialInput, ProviderInput, RegisterResult} from '@nextjs-expressjs-postgresql/shared'
import { loginWithCredentials, registerCredentials } from "./providers/credential-auth.service";
import { verifyRefreshToken, generateAccessToken, generateRefreshToken } from './utils/jwt.util';
import ms, { StringValue } from "ms";
import { prisma } from "../../integrations/prisma";

export async function registerService(input: ProviderInput): Promise<RegisterResult> {
  switch (input.provider) {
    case AuthProvider.CREDENTIALS:
      return registerCredentials(input.data as CredentialInput);
    case AuthProvider.GOOGLE:
      // return loginWithGoogle(input.data);
    case AuthProvider.MAGIC_LINK:
      // return loginWithMagicLink(input.data);
    default:
      throw new HttpError(400, 'Unsupported register provider')      
  }
};

export async function loginService(input: ProviderInput): Promise<AuthResult> {
  switch (input.provider) {
    case AuthProvider.CREDENTIALS:
      return loginWithCredentials(input.data as CredentialInput);
    case AuthProvider.GOOGLE:
      // return loginWithGoogle(input.data);
    case AuthProvider.MAGIC_LINK:
      // return loginWithMagicLink(input.data);
    default:
      throw new HttpError(400, 'Unsupported login provider')      
  }
};

export async function logoutService(refreshToken: string, ip: string, userAgent: string): Promise<void> {
  await prisma.refreshToken.updateMany({
    where: { 
      token: refreshToken,
      ip,
      userAgent
     },
    data: { revoked: true }
  });
}

export async function refreshTokenService(refreshToken: string, ip: string, userAgent: string) {
  const payload = verifyRefreshToken(refreshToken);
  const storedToken = await prisma.refreshToken.findUnique({ 
    where: { 
        token: refreshToken,
        ip,
        userAgent
    } 
});

  if (!storedToken || storedToken.revoked || storedToken.expiresAt < new Date()) {
    throw new Error('Invalid or expired refresh token');
  }

  const newAccessToken = generateAccessToken(payload);
  const newRefreshToken = generateRefreshToken(payload);

  await prisma.refreshToken.update({
    where: { token: refreshToken },
    data: { revoked: true }
  });

  await prisma.refreshToken.create({
    data: {
      token: newRefreshToken,
      userId: payload.userId,
      ip,
      userAgent,
      expiresAt: new Date(Date.now() + ms(process.env.BACKEND_JWT_REFRESH_EXPIRATION as StringValue)),
    }
  });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}