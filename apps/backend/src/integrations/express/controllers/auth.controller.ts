import { Request, Response } from 'express';
import { loginService, logoutService, refreshTokenService, registerService } from '../../../services/auth/auth.service';
import { getRequestIpUserAgent } from '../util';
import HttpError from '../../../utils/error/http-error';
import { AUTH_PROVIDER } from '@nextjs-expressjs-postgresql/shared/constants/auth-provider.constants';
import ms, { StringValue } from 'ms';
import { COOKIES } from '@nextjs-expressjs-postgresql/shared/constants/cookies.constants';
import { createResponse } from '../helpers/create-reponse';

export const registerController = async (
  req: Request,
  res: Response
) => {
  const { ip, userAgent } = getRequestIpUserAgent(req);

  await registerService({ 
    provider: AUTH_PROVIDER.CREDENTIALS, 
    data: { 
      email: req.body.email, 
      password: req.body.password,
      ip,
      userAgent
    } 
  });

  return res.status(201).json(createResponse('success', undefined, 'User registered successfully'));
};

export const loginController = async (
  req: Request,
  res: Response
 ) => {
  const { ip, userAgent } = getRequestIpUserAgent(req);

  const loginResult = await loginService({ 
    provider: AUTH_PROVIDER.CREDENTIALS, 
    data: { 
      email: req.body.email, 
      password: req.body.password,
      ip,
      userAgent
    } 
  });

  res.cookie(COOKIES.accessToken, loginResult.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: ms(process.env.BACKEND_JWT_EXPIRATION as StringValue)
  });

  res.cookie(COOKIES.refreshToken, loginResult.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: ms(process.env.BACKEND_JWT_REFRESH_EXPIRATION as StringValue)
  }); 

  return res.json(createResponse('success', undefined, 'Logged in successfully' ));
}

export const logoutController = async (
  req: Request,
  res: Response
) => {
  const refreshToken = req.body.refreshToken;
  const { ip, userAgent } = getRequestIpUserAgent(req);

  if (!refreshToken) throw new HttpError(400, 'Refresh token required');

  await logoutService(refreshToken, ip, userAgent);

  return res.json(createResponse('success', undefined, 'Logged out successfully' ));
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

  res.cookie(COOKIES.accessToken, refreshResult.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: ms(process.env.BACKEND_JWT_EXPIRATION as StringValue)
  });

  res.cookie(COOKIES.refreshToken, refreshResult.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: ms(process.env.BACKEND_JWT_REFRESH_EXPIRATION as StringValue)
  }); 

  return res.json(createResponse('success', undefined, 'Refreshed successfully' ));
}