import { Request, Response } from 'express';
import { loginService, registerService } from '../../../services/auth/auth.service';
import { AuthProvider } from '@nextjs-expressjs-postgresql/shared';
import { refreshTokenService } from '../../../services/auth/refresh-token.service';
import { getRequestIpUserAgent } from '../util';

export const registerController = async (
  req: Request,
  res: Response
) => {
  const { ip, userAgent } = getRequestIpUserAgent(req);

  await registerService({ 
    provider: AuthProvider.CREDENTIALS, 
    data: { 
      email: req.body.email, 
      password: req.body.password,
      ip,
      userAgent
    } 
  });

  return res.status(201).json({ message: 'User registered successfully' });
};

export const loginController = async (
  req: Request,
  res: Response
) => {
  const { ip, userAgent } = getRequestIpUserAgent(req);

  const loginResult = await loginService({ 
    provider: AuthProvider.CREDENTIALS, 
    data: { 
      email: req.body.email, 
      password: req.body.password,
      ip,
      userAgent
    } 
  });

  return res.json(loginResult);
}

export const refreshController = async (
  req: Request,
  res: Response
) => {
  const { ip, userAgent } = getRequestIpUserAgent(req);

  const refreshResult = await refreshTokenService(
    req.body.refreshToken, 
    ip, 
    userAgent
  );

  return res.json(refreshResult);
}
