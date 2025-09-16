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

  if (path.startsWith("/admin") && (!session?.userId || session?.role !== Role.ADMIN)) {
    return NextResponse.redirect(new URL('/auth/unauthorized', request.nextUrl));
  }

  if (path.startsWith("/client") && (!session?.userId || (session?.role !== Role.CLIENT && session?.role !== Role.ADMIN))) {
    return NextResponse.redirect(new URL('/auth/unauthorized', request.nextUrl));
  }

  // Vendor dashboard routes — check membership. Path expected: /vendor/:slug/...
  if (path.startsWith('/vendor')) {
    // allow admins
    if (session?.role === Role.ADMIN) return res;

    // extract slug from path
    const parts = path.split('/').filter(Boolean);
    const slug = parts[1];
    if (!slug) return NextResponse.redirect(new URL('/auth/unauthorized', request.nextUrl));

    try {
      const url = new URL(`/api/vendor/${slug}/is-member`, request.url);
      const membershipRes = await fetch(url.toString(), { method: 'GET', credentials: 'include' });
      if (membershipRes.ok) {
        const data = await membershipRes.json();
        if (data.isMember) return res;
      }
    } catch (e) {
      // allow fallback deny
    }

    return NextResponse.redirect(new URL('/auth/unauthorized', request.nextUrl));
  }

  return res;
}