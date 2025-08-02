import { Request, Response } from 'express';
import { loginService, registerService } from '../../../services/auth/auth.service';
import { AuthProvider } from '@nextjs-expressjs-postgresql/shared';
import { refreshTokenService } from '../../../services/auth/refresh-token.service';


export const registerController = async (
  req: Request,
  res: Response
) => {
  await registerService({ 
    provider: AuthProvider.CREDENTIALS, 
    data: { 
      email: req.body.email, 
      password: req.body.password,
      ip: req.ip,
      userAgent: req.headers['user-agent']
    } 
  });

  return res.status(201).json({ message: 'User registered successfully' });
};

export const loginController = async (
  req: Request,
  res: Response
) => {
  const loginResult = await loginService({ 
    provider: AuthProvider.CREDENTIALS, 
    data: { 
      email: req.body.email, 
      password: req.body.password,
      ip:req.ip,
      userAgent: req.headers['user-agent']
    } 
  });

  return res.json(loginResult);
}

export const refreshController = async (
  req: Request,
  res: Response
) => {
  const refreshResult = await refreshTokenService(
    req.body.refreshToken, 
    req.ip, 
    req.headers['user-agent']
  );

  return res.json(refreshResult);
}
