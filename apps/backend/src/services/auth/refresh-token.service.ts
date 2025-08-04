import ms, { StringValue } from "ms";
import { prisma } from "../../integrations/prisma";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "./utils/jwt.util";

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