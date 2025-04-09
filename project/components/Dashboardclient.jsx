'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Package, Plus, Users, LogOut, DollarSign } from 'lucide-react';

export default function DashboardPage() {
  const [products, setProducts] = useState([]);
  const [activeUsers, setActiveUsers] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    rating: '',
    image: '',
  });


  const router = useRouter();
  

  useEffect(() => {
    fetch('/api/user')
      .then((res) => res.json())
      .then((data) => setProducts(data));

    fetch('/api/stats')
      .then((res) => res.json())
      .then((data) => {
        setActiveUsers(data.totalUsers);
        setTotalProducts(data.totalProducts);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = editingProduct ? 'PATCH' : 'POST';
    const payload = {
      ...newProduct,
      price: parseFloat(newProduct.price),
      rating: parseFloat(newProduct.rating),
    };
    if (editingProduct) payload.id = editingProduct.id;

    const res = await fetch('/api/product', {
      method,
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      const { data } = await res.json();
      if (editingProduct) {
        setProducts((prev) => prev.map((p) => (p.id === data.id ? data : p)));
        alert('Product updated!');
      } else {
        setProducts((prev) => [...prev, data]);
        alert('Product added!');
      }

      setNewProduct({
        name: '',
        description: '',
        price: '',
        category: '',
        rating: '',
        image: '',
      });
      setShowForm(false);
      setEditingProduct(null);
    } else {
      alert('Failed to submit product');
    }
  };

  const handleDelete = async (id) => {
    const confirmed = confirm('Are you sure you want to delete this product?');
    if (!confirmed) return;

    const res = await fetch(`/api/product?id=${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      alert('Product deleted!');
    } else {
      alert('Failed to delete product');
    }
  };

  const handleSignout = async () => {
    await fetch('/api/auth/signout');
    router.push('/');
  };

  return (
    <div className="container mx-auto p-6">
      {/* Top Header with Sign Out */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-bold text-purple-600">Dashboard</h1>
        <Button onClick={handleSignout} variant="outline" className="bg-purple-600 text-white hover:bg-purple-700">
          <LogOut className="mr-2 h-4 w-4" /> Sign Out
        </Button>
      </div>

      {/* Dashboard Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="border-purple-500/20 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-lg font-semibold">My Products</h4>
              <Package className="text-purple-500" />
            </div>
            <p className="text-3xl font-bold">{products.length}</p>
          </CardContent>
        </Card>

        <Card className="border-purple-500/20 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-lg font-semibold">Total Sales</h4>
              <DollarSign className="text-purple-500" />
            </div>
            <p className="text-3xl font-bold">{activeUsers}</p>
          </CardContent>
        </Card>

        <Card className="border-purple-500/20 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-lg font-semibold">Products Selled</h4>
              <Package className="text-purple-500" />
            </div>
            <p className="text-3xl font-bold">{totalProducts}</p>
          </CardContent>
        </Card>
      </div>

      {/* Products Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold tracking-tight">Products</h2>
          <Button className="bg-primary hover:bg-primary/90" onClick={() => {
            setShowForm(!showForm);
            setEditingProduct(null);
            setNewProduct({
              name: '',
              description: '',
              price: '',
              category: '',
              rating: '',
              image: '',
            });
          }}>
            <Plus className="mr-2 h-4 w-4" /> {showForm ? 'Cancel' : 'Add Product'}
          </Button>
        </div>

        {/* Product Form */}
        {showForm && (
          <Card className="col-span-full border-purple-500/20 mb-8">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { label: 'Product Name', name: 'name' },
                  { label: 'Description', name: 'description', type: 'textarea' },
                  { label: 'Price', name: 'price', type: 'number' },
                  { label: 'Category', name: 'category' },
                  { label: 'Rating', name: 'rating', type: 'number' },
                  { label: 'Image URL', name: 'image' },
                ].map(({ label, name, type }) => (
                  <div key={name}>
                    <label className="block text-sm font-medium">{label}</label>
                    {type === 'textarea' ? (
                      <textarea
                        value={newProduct[name]}
                        onChange={(e) => setNewProduct({ ...newProduct, [name]: e.target.value })}
                        className="w-full mt-1 p-2 border rounded-md"
                        required
                      />
                    ) : (
                      <input
                        type={type || 'text'}
                        value={newProduct[name]}
                        onChange={(e) => setNewProduct({ ...newProduct, [name]: e.target.value })}
                        className="w-full mt-1 p-2 border rounded-md"
                        required
                      />
                    )}
                  </div>
                ))}
                <Button type="submit" className="bg-primary text-white">
                  {editingProduct ? 'Update Product' : 'Submit'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Product Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.length === 0 ? (
            <Card className="col-span-full border-dashed border-2 border-primary/20">
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Package className="h-12 w-12 text-primary/50 mb-4" />
                <p className="text-lg text-muted-foreground text-center">
                  No products yet. Click the "Add Product" button to get started.
                </p>
              </CardContent>
            </Card>
          ) : (
            products.map((product) => (
              <Card key={product.id} className="border-purple-500/20">
                <CardContent className="p-6 space-y-2">
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-40 object-cover rounded-md mb-2"
                    />
                  )}
                  <h3 className="font-semibold text-xl">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{product.description}</p>
                  <div className="text-sm text-muted-foreground">Category: {product.category}</div>
                  <div className="text-sm text-muted-foreground">Rating: {product.rating} ⭐</div>
                  <div className="text-sm text-muted-foreground">User ID: {product.userId}</div>
                  <div className="flex justify-between items-center pt-2 space-x-2">
                    <span className="font-bold text-lg">${parseFloat(product.price).toFixed(2)}</span>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        className="text-blue-600 border-blue-600"
                        onClick={() => {
                          setEditingProduct(product);
                          setNewProduct({
                            name: product.name,
                            description: product.description,
                            price: product.price,
                            category: product.category,
                            rating: product.rating,
                            image: product.image,
                          });
                          setShowForm(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button variant="destructive" onClick={() => handleDelete(product.id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
