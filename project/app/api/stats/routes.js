import { db } from '@/app/drizzle/db';
import { products } from '/drizzle/schema';
import { users } from '/drizzle/schema';
import { eq, count } from 'drizzle-orm';

export async function GET() {
  try {
    const totalProducts = await db.select().from(products);
    const totalUsers = await db.select().from(users);

    return Response.json({
      totalProducts: totalProducts.length,
      totalUsers: totalUsers.length,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}
