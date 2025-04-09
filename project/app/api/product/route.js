import { db } from '@/lib/db';
import { products } from '@/drizzle/schema';
import { NextResponse } from 'next/server';
import { getUser } from '@/lib/auth';
import { eq } from 'drizzle-orm';

// CREATE Product
export async function POST(req) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, description, category, price, rating, image } = body;

    if (!name || !description || !category || !price || !rating) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const inserted = await db
      .insert(products)
      .values({
        name,
        description,
        category,
        price,
        rating,
        image,
        userId: user.id,
      })
      .returning();

    return NextResponse.json(
      { data: inserted[0], message: 'Product added' },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/product error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: error.message },
      { status: 500 }
    );
  }
}

// GET All Products (not just user's)
export async function GET() {
  try {
    const allProducts = await db.select().from(products);
    return NextResponse.json(allProducts, { status: 200 });
  } catch (error) {
    console.error('GET /api/product error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: error.message },
      { status: 500 }
    );
  }
}

// DELETE Product
export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing product ID' }, { status: 400 });
  }

  try {
    await db.delete(products).where(eq(products.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/product error:', error);
    return NextResponse.json(
      { message: 'Failed to delete product', error: error.message },
      { status: 500 }
    );
  }
}

// UPDATE Product
export async function PATCH(req) {
  try {
    const body = await req.json();
    const { id, name, description, category, price, rating, image } = body;

    if (!id) {
      return NextResponse.json({ message: 'Missing product ID' }, { status: 400 });
    }

    const updated = await db
      .update(products)
      .set({ name, description, category, price, rating, image })
      .where(eq(products.id, id))
      .returning();

    return NextResponse.json({ data: updated[0], message: 'Product updated' });
  } catch (error) {
    console.error('PATCH /api/product error:', error);
    return NextResponse.json(
      { message: 'Failed to update product', error: error.message },
      { status: 500 }
    );
  }
}
