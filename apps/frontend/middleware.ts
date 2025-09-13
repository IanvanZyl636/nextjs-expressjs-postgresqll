import { NextRequest, NextResponse } from 'next/server';
import { getSession, updateSession } from './lib/auth';
import { Role } from '@nextjs-expressjs-postgresql/shared/prisma/enhance/enums';

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}

export default async function middleware(request: NextRequest) {
  const res = await updateSession(request);
  const session = await getSession();

  const path = request.nextUrl.pathname;

  if ((path === "/admin" || path.startsWith("/admin/")) && (!session?.userId || session?.role !== Role.ADMIN)) {
    return NextResponse.redirect(new URL('/auth/unauthorized', request.nextUrl));
  }

  if ((path === "/client" || path.startsWith("/client/")) && (!session?.userId || (session?.role !== Role.CLIENT && session?.role !== Role.ADMIN))) {
    return NextResponse.redirect(new URL('/auth/unauthorized', request.nextUrl));
  }

  return res;
}