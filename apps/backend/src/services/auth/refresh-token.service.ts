import { prisma } from "../../integrations/prisma";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "./utils/jwt.util";

export async function refreshTokenService(refreshToken: string, ip?: string, userAgent?: string) {
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

  const newAccessToken = generateAccessToken(payload.sub);
  const newRefreshToken = generateRefreshToken(payload.sub);

  await prisma.refreshToken.update({
    where: { token: refreshToken },
    data: { revoked: true }
  });

  await prisma.refreshToken.create({
    data: {
      token: newRefreshToken,
      userId: payload.sub,
      ip,
      userAgent,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    }
  });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}