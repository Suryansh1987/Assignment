import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'; // fallback if not defined
  const response = NextResponse.redirect(new URL('/signin', baseUrl));

  response.cookies.set('token', '', {
    maxAge: 0,
    path: '/',
    httpOnly: true,
  });

  return response;
}
