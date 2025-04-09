import { db } from '@/lib/db';
import { products } from '@/drizzle/schema';
import { NextResponse } from 'next/server';
import { getUser } from '@/lib/auth';
import { eq } from 'drizzle-orm';

// GET: fetch products by logged-in user
export async function GET() {
  const user = await getUser();
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const userProducts = await db
    .select()
    .from(products)
    .where(eq(products.userId, user.id));

  return NextResponse.json(userProducts);
}

// DELETE: delete a product by ID (must belong to logged-in user)
export async function DELETE(req) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ message: 'Missing product ID' }, { status: 400 });

    const deleted = await db
      .delete(products)
      .where(eq(products.id, id))
      .where(eq(products.userId, user.id))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json({ message: 'Product not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product deleted', data: deleted[0] });
  } catch (err) {
    console.error('DELETE error:', err);
    return NextResponse.json({ message: 'Server error', error: err.message }, { status: 500 });
  }
}

// PATCH: update a product by ID (must belong to logged-in user)
export async function PATCH(req) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { id, ...updates } = await req.json();

    if (!id) return NextResponse.json({ message: 'Missing product ID' }, { status: 400 });

    const updated = await db
      .update(products)
      .set(updates)
      .where(eq(products.id, id))
      .where(eq(products.userId, user.id))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ message: 'Product not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product updated', data: updated[0] });
  } catch (err) {
    console.error('PATCH error:', err);
    return NextResponse.json({ message: 'Server error', error: err.message }, { status: 500 });
  }
}
