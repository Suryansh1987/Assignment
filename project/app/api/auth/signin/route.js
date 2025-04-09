export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { users } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { createToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    console.log('Email and password received:', email);

    const user = await db.select().from(users).where(eq(users.email, email)).limit(1);
    console.log('User lookup result:', user);

    if (user.length === 0) {
      console.log('No user found');
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user[0].password);
    console.log('Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    const token = await createToken(user[0]);
    console.log('Token created:', token);

    const cookieStore = cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });

    console.log('Cookie set successfully');

    return NextResponse.json({ token: token,
      message: 'Signed in successfully' }, { status: 200 });
  } catch (error) {
    console.error('Signin error:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
