import { Request } from 'express';

export function getRequestIpUserAgent(req: Request): { ip: string, userAgent: string } {
  const ip = req.ip || req.socket.remoteAddress || req.headers['x-forwarded-for'] as string | undefined || 'unknown';
  const userAgent = req.headers['user-agent'] || 'unknown';

  return { ip, userAgent };
}