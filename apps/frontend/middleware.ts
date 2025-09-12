import { NextRequest } from 'next/server';
import { updateSession } from './lib/auth';

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}

export default async function middleware(request: NextRequest) {
  return await updateSession(request);
}