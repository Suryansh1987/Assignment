import { db } from '@/lib/db';
import { users } from '@/drizzle/schema';

export async function GET() {
  try {
    const result = await db.select().from(users); // get all users
    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify([]), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}
