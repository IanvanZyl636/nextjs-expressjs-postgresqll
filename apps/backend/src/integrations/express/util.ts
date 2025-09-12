import { Request } from 'express';

export function getRequestIpUserAgent(req: Request): { ip: string, userAgent: string } {
  const ip = req.headers['x-forwarded-for'] as string | undefined || req.ip || req.socket.remoteAddress || 'unknown';
  const userAgent = req.headers['user-agent'] || 'unknown';

  return { ip, userAgent };
}