import { NextFunction, Request, Response } from 'express';
import logger from '../../winston';
import HttpError from '../../../utils/error/http-error';

const errorLogger = (
  err: Error | HttpError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try{
  const statusCode = err instanceof HttpError ? err.statusCode : 500;
  const message = err.stack || 'Internal Server Error';

  const requestData =
    req.method === 'GET'
      ? { query: req.query }
      : { body: req.body };

  logger.error({
    message:`[${req.method}] ${req.originalUrl} - ${statusCode}\n${message}`,
    requestData
  });

  res.status(statusCode).json({
    error: 'Internal Server Error',
  });
  }catch(e){
    next(e);
  }
};

export default errorLogger;
