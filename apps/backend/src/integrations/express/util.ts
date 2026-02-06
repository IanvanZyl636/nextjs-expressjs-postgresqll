import { Request } from 'express';

export function getRequestIpUserAgent(req: Request): { ip: string, userAgent: string } {
  const ip = req.headers['x-forwarded-for'] as string | undefined || req.headers['cf-connecting-ip'] as string | undefined || req.ip || req.socket.remoteAddress || 'unknown';
  const userAgent = req.headers['user-agent'] || 'unknown';

  return { ip, userAgent };
}

export function getRequestDomain(req: Request): string {
  try {
    const referer = req.headers.referer;

    if (!referer || typeof referer !== 'string') {
      throw new Error('Referer header is missing or invalid');
    }

    const url = new URL(referer);
    return url.hostname;
  } catch (error) {
    throw new Error(`Unable to determine request domain: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}