import { NextRequest, NextResponse } from 'next/server';
import { getSession, updateSession } from './lib/auth';
import { Role } from '@nextjs-expressjs-postgresql/shared/prisma/enhance/enums';

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
  runtime: "nodejs"
}

export default async function middleware(request: NextRequest) {
  const {response} = await updateSession(request);
  const session = await getSession();

  const path = request.nextUrl.pathname;

  if (path.startsWith("/admin") && (!session?.user.userId || session?.user.role !== Role.ADMIN)) {
    return NextResponse.redirect(new URL('/auth/unauthorized', request.nextUrl));
  }

  if (path.startsWith("/client") && (!session?.user.userId || (session?.user.role !== Role.CLIENT && session?.user.role !== Role.ADMIN))) {
    return NextResponse.redirect(new URL('/auth/unauthorized', request.nextUrl));
  }

  if (path.startsWith('/vendor')) {
    if (session?.user.role === Role.ADMIN) return response;

    const parts = path.split('/').filter(Boolean);
    const slug = parts[1];
    if (!slug) return NextResponse.redirect(new URL('/auth/unauthorized', request.nextUrl));
    
    if(session && session.user.vendorSlugs.includes(slug)){
      return response;
    }

    return NextResponse.redirect(new URL('/auth/unauthorized', request.nextUrl));
  }

  return response;
}