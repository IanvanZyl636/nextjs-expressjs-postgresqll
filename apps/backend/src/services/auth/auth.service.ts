import HttpError from "../../utils/error/http-error";
import {AuthProvider, AuthResult, CredentialInput, ProviderInput, RegisterResult, Role, TokenType} from '@nextjs-expressjs-postgresql/shared'
import { loginWithCredentials, registerCredentials } from "./providers/credential-auth.service";
import { verifyRefreshToken, generateAccessToken, generateRefreshToken } from './utils/jwt.util';
import ms, { StringValue } from "ms";
import { prisma } from "../../integrations/prisma";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { sendEmail } from "../../integrations/nodemailer";
import { MailTemplateType } from "../../integrations/nodemailer/constants/mail-template.constants";

export async function registerService(input: ProviderInput, role:Role = Role.CLIENT): Promise<RegisterResult> {
  switch (input.provider) {
    case AuthProvider.CREDENTIALS:
      return registerCredentials(input.data as CredentialInput, role);
    case AuthProvider.GOOGLE:
      // return loginWithGoogle(input.data);
    case AuthProvider.MAGIC_LINK:
      // return loginWithMagicLink(input.data);
    default:
      throw new HttpError(400, 'Unsupported register provider')      
  }
}

export async function loginService(input: ProviderInput, role:Role = Role.CLIENT): Promise<AuthResult> {
  switch (input.provider) {
    case AuthProvider.CREDENTIALS:
      return loginWithCredentials(input.data as CredentialInput, role);
    case AuthProvider.GOOGLE:
      // return loginWithGoogle(input.data);
    case AuthProvider.MAGIC_LINK:
      // return loginWithMagicLink(input.data);
    default:
      throw new HttpError(400, 'Unsupported login provider')      
  }
}

export async function logoutService(refreshToken: string, ip: string, userAgent: string): Promise<void> {
  await prisma.token.updateMany({
    where: { 
      type: TokenType.REFRESH,
      token: refreshToken,
      ip,
      userAgent
     },
    data: { revoked: true }
  });
}

export async function refreshTokenService(refreshToken: string, ip: string, userAgent: string) {
  const payload = verifyRefreshToken(refreshToken);
  const storedToken = await prisma.token.findUnique({ 
    where: { 
        token: refreshToken,
        type: TokenType.REFRESH,
        ip,
        userAgent
    } 
});

  if (!storedToken || storedToken.revoked || storedToken.expiresAt < new Date()) {
    throw new HttpError(400, 'Invalid or expired refresh token');
  }

  const newAccessToken = generateAccessToken(payload);
  const newRefreshToken = generateRefreshToken(payload);

  await prisma.token.update({
    where: { token: refreshToken, type: TokenType.REFRESH },
    data: { revoked: true }
  });

  await prisma.token.create({
    data: {
      type: TokenType.REFRESH,
      token: newRefreshToken,
      userId: payload.userId,
      ip,
      userAgent,
      expiresAt: new Date(Date.now() + ms(process.env.BACKEND_JWT_REFRESH_EXPIRATION as StringValue)),
    }
  });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}

export async function forgotPasswordService(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  const resetToken = crypto.randomBytes(32).toString("hex");

  if (!user) return;
  
  
  const expiresAt = new Date(Date.now() + ms("1h"));

  await prisma.token.create({
    data: {
      token: resetToken,
      userId: user.id,
      expiresAt,
      revoked: false,
      type: TokenType.PASSWORD_RESET
    }
  });

 sendEmail({
    emailType: MailTemplateType.FORGOTTEN_PASSWORD,
    data: { resetLink: `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}` }
  });
}

export async function resetPasswordService(token: string, newPassword: string): Promise<void> {
  const resetRecord = await prisma.token.findUnique({ where: { token, type: TokenType.PASSWORD_RESET } });
  if (
    !resetRecord ||
    resetRecord.revoked ||
    resetRecord.expiresAt < new Date()
  ) {
    throw new HttpError(400, "Invalid or expired password reset token");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: resetRecord.userId },
    data: { passwordHash: hashedPassword }
  });

  await prisma.token.update({
    where: { token, type: TokenType.PASSWORD_RESET },
    data: { revoked: true }
  });
}

export async function requestEmailVerificationService(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new HttpError(404, "User not found");
  }

  const verificationToken = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + ms("24h"));

  await prisma.token.create({
    data: {
      type: TokenType.EMAIL_VERIFICATION,
      token: verificationToken,
      userId: user.id,
      expiresAt,
      revoked: false,
    }
  });

  sendEmail({
    emailType: MailTemplateType.EMAIL_VERIFICATION,
    data: { verificationLink: `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}` }
  });
}

export async function verifyEmailService(token: string): Promise<void> {
  const record = await prisma.token.findUnique({ where: { token, type: TokenType.EMAIL_VERIFICATION } });
  if (
    !record ||
    record.revoked ||
    record.expiresAt < new Date()
  ) {
    throw new HttpError(400, "Invalid or expired email verification token");
  }

  await prisma.user.update({
    where: { id: record.userId },
    data: { emailVerifiedAt: new Date() }
  });

  await prisma.token.update({
    where: { token, type: TokenType.EMAIL_VERIFICATION },
    data: { revoked: true }
  });
}