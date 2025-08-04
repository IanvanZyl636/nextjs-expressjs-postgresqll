import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export const generateAccessToken = (data:{ userId: string, ip:string, userAgent:string } ) => {
  return jwt.sign(data, ACCESS_SECRET, { expiresIn: '15m' });
};

export const generateRefreshToken = (data:{ userId: string, ip:string, userAgent:string } ) => {
  return jwt.sign(data, REFRESH_SECRET, { expiresIn: '7d' });
};

export const verifyAccessToken = (token: string):{ userId: string, ip:string, userAgent:string } => jwt.verify(token, ACCESS_SECRET) as { userId: string, ip:string, userAgent:string };
export const verifyRefreshToken = (token: string):{ userId: string, ip:string, userAgent:string } => jwt.verify(token, REFRESH_SECRET) as { userId: string, ip:string, userAgent:string };
