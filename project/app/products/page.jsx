'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Package } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [rating, setRating] = useState('');

  useEffect(() => {
    fetch('/api/product')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      });
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase());

    const matchesPrice =
      (minPrice === '' || parseFloat(product.price) >= parseFloat(minPrice)) &&
      (maxPrice === '' || parseFloat(product.price) <= parseFloat(maxPrice));

    const matchesRating =
      rating === '' || parseFloat(product.rating) >= parseFloat(rating);

    return matchesSearch && matchesPrice && matchesRating;
  });

  return (
    <div className="min-h-screen bg-white text-black p-6">
      <h1 className="text-4xl font-bold mb-8 text-purple-700">All Products</h1>

      {/* 🔍 Search + Filter Options */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          type="text"
          placeholder="Search by name or description"
          className="border-purple-500 focus-visible:ring-purple-600"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Min Price"
          className="border-purple-500 focus-visible:ring-purple-600"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Max Price"
          className="border-purple-500 focus-visible:ring-purple-600"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Min Rating (0-5)"
          min={0}
          max={5}
          className="border-purple-500 focus-visible:ring-purple-600"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        />
      </div>

      {/* 🧾 Product List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.length === 0 ? (
          <Card className="col-span-full border-dashed border-2 border-purple-300 bg-purple-50 text-purple-700">
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Package className="h-12 w-12 text-purple-500 mb-4" />
              <p className="text-lg text-center">No products found.</p>
            </CardContent>
          </Card>
        ) : (
          filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="bg-white border border-purple-300 text-black shadow-md"
            >
              <CardContent className="p-6 space-y-2">
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded-md mb-2"
                  />
                )}
                <h3 className="font-semibold text-xl text-purple-700">{product.name}</h3>
                <p className="text-sm text-gray-700">{product.description}</p>
                <div className="text-sm text-gray-600">Category: {product.category}</div>
                <div className="text-sm text-gray-600">Rating: {product.rating} ⭐</div>
                <div className="flex justify-between items-center pt-2">
                  <span className="font-bold text-lg text-purple-700">
                    ${parseFloat(product.price).toFixed(2)}
                  </span>
                  <Button variant="outline" className="border-purple-500 text-purple-700 hover:bg-purple-50">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
