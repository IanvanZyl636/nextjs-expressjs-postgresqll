import jwt from 'jsonwebtoken';
import { StringValue } from 'ms';
import {JwtPayload} from '@nextjs-expressjs-postgresql/shared/models/jwt-payload.model';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export const generateAccessToken = (data: JwtPayload) => {
  return jwt.sign(data, ACCESS_SECRET, { expiresIn: process.env.BACKEND_JWT_EXPIRATION as StringValue });
};

export const generateRefreshToken = (data:JwtPayload ) => {
  return jwt.sign(data, REFRESH_SECRET, { expiresIn: process.env.BACKEND_JWT_REFRESH_EXPIRATION as StringValue });
};

export const verifyAccessToken = (token: string):JwtPayload => {
  const {user} = jwt.verify(token, ACCESS_SECRET) as JwtPayload;

  return {user};
};
export const verifyRefreshToken = (token: string):JwtPayload => {
  const {user} = jwt.verify(token, REFRESH_SECRET) as JwtPayload;

  return {user};
};
