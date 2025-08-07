import { Role } from '@nextjs-expressjs-postgresql/shared';
import jwt from 'jsonwebtoken';
import { StringValue } from 'ms';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export interface JwtPayload {
  userId: string;
  role: Role;
  ip: string;
  userAgent: string;
}

export const generateAccessToken = (data: JwtPayload) => {
  return jwt.sign(data, ACCESS_SECRET, { expiresIn: process.env.BACKEND_JWT_EXPIRATION as StringValue });
};

export const generateRefreshToken = (data:JwtPayload ) => {
  return jwt.sign(data, REFRESH_SECRET, { expiresIn: process.env.BACKEND_JWT_REFRESH_EXPIRATION as StringValue });
};

export const verifyAccessToken = (token: string):JwtPayload => {
  const {userId, role, ip, userAgent} = jwt.verify(token, ACCESS_SECRET) as JwtPayload;

  return {userId, role, ip, userAgent};
};
export const verifyRefreshToken = (token: string):JwtPayload => {
  const {userId, role, ip, userAgent} = jwt.verify(token, REFRESH_SECRET) as JwtPayload;

  return {userId, role, ip, userAgent};
};
