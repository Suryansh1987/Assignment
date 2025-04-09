import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { users } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);
const alg = 'HS256';

// Setup DB (only works in Node.js runtime)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema: { users } });

export async function createToken(user) {
  return await new SignJWT({ userId: user.id, email: user.email, role: user.role })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret);
}

export async function verifyToken() {
  const cookieStore = cookies();
  const token = cookieStore.get('token');

  if (!token) return null;

  try {
    const verified = await jwtVerify(token.value, secret);
    return verified.payload;
  } catch (err) {
    return null;
  }
}

export async function getUser() {
  const payload = await verifyToken();
  if (!payload) return null;

  const user = await db.select().from(users).where(eq(users.id, payload.userId)).limit(1);
  return user[0] || null;
}
