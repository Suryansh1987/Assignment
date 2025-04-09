export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { verifyOnlyToken } from '@/lib/verify-token';

const publicPaths = ['/', '/login', '/register', '/products'];

export async function middleware(request) {
  const token = request.cookies.get('token');
  const pathname = request.nextUrl.pathname;

  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const verified = await verifyOnlyToken(token.value);

  if (!verified) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard', '/profile/:path*'],
};
