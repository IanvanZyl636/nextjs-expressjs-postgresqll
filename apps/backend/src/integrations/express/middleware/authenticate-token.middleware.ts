
import { Response, NextFunction } from 'express';
import { verifyAccessToken } from '../../../services/auth/utils/jwt.util';
import HttpError from '../../../utils/error/http-error';
import { AuthenticatedRequest } from '../models/authenticated-request.model';
import { getRequestIpUserAgent } from '../util';

export function authenticateTokenMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) throw new HttpError(401, 'No token provided');

  const user = verifyAccessToken(token);
  const { userAgent } = getRequestIpUserAgent(req);

  if (user.userAgent !== userAgent) throw new HttpError(403, 'User-Agent mismatch');

  req.userId = user.userId;
  next();
}