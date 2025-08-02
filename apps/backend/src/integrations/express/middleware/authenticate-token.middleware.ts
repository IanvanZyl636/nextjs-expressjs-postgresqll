
import {Response, NextFunction } from 'express';
import { verifyAccessToken } from '../../../services/auth/utils/jwt.util';
import HttpError from '../../../utils/error/http-error';
import { AuthenticatedRequest } from '../models/authenticated-request.model';

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) throw new HttpError(401,'No token provided');

  try {
    const user = verifyAccessToken(token);

    req.userId = user.sub;
    next();
  } catch (err) {    
    throw new HttpError(403,'Invalid token');
  }
}