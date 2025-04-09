'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Package, Plus, LogOut, DollarSign, Moon, Sun } from 'lucide-react';

export default function DashboardPage() {
  const [products, setProducts] = useState([]);
  const [activeUsers, setActiveUsers] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    rating: '',
    image: '',
  });

  
  const theme = {
    light: {
      background: 'bg-[#FFFFFF]',
      card: 'bg-white',
      cardBorder: 'border-[#E5E5E5]',
      primary: 'bg-[#333333]', 
      primaryHover: 'hover:bg-[#000000]',
      text: 'text-[#333333]',
      textSecondary: 'text-[#6C757D]',
      accent: 'text-[#333333]',
      button: 'bg-[#333333] hover:bg-[#000000] text-white',
      outlineButton: 'border-[#333333] text-[#333333] hover:bg-[#F0F0F0] hover:text-[#000000]',
      inputBg: 'bg-white',
      inputBorder: 'border-gray-300',
      inputText: 'text-gray-900',
    },
    dark: {
      background: 'bg-[#1A1A1A]',
      card: 'bg-white', 
      cardBorder: 'border-[#E5E5E5]',
      primary: 'bg-[#333333]', 
      primaryHover: 'hover:bg-[#000000]',
      text: 'text-[#333333]', 
      textSecondary: 'text-[#6C757D]', 
      accent: 'text-[#333333]',
      button: 'bg-[#333333] hover:bg-[#000000] text-white',
      outlineButton: 'border-[#333333] text-[#333333] hover:bg-[#F0F0F0] hover:text-[#000000]',
      inputBg: 'bg-white',
      inputBorder: 'border-gray-300',
      inputText: 'text-gray-900',
    }
  };

 
  const currentTheme = darkMode ? theme.dark : theme.light;

  useEffect(() => {
  
    if (darkMode) {
      document.body.classList.add('bg-[#1A1A1A]', 'text-white');
      document.body.classList.remove('bg-white', 'text-[#333333]');
    } else {
      document.body.classList.add('bg-white', 'text-[#333333]');
      document.body.classList.remove('bg-[#1A1A1A]', 'text-white');
    }

    fetch('/api/user')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(error => console.error('Error fetching user data:', error));

    fetch('/api/stats')
      .then((res) => res.json())
      .then((data) => {
        setActiveUsers(data.totalUsers);
        setTotalProducts(data.totalProducts);
      })
      .catch(error => console.error('Error fetching stats:', error));
  }, [darkMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = editingProduct ? 'PATCH' : 'POST';
    const payload = {
      ...newProduct,
      price: parseFloat(newProduct.price),
      rating: parseFloat(newProduct.rating),
    };
    if (editingProduct) payload.id = editingProduct.id;

    try {
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
    } catch (error) {
      console.error('Error submitting product:', error);
      alert('An error occurred while submitting the product');
    }
  };

  const handleDelete = async (id) => {
    const confirmed = confirm('Are you sure you want to delete this product?');
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/product?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        alert('Product deleted!');
      } else {
        alert('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('An error occurred while deleting the product');
    }
  };

  const handleSignout = async () => {
    try {
      await fetch('/api/auth/signout');
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
      alert('An error occurred while signing out');
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen ${currentTheme.background} ${currentTheme.text} transition-colors duration-200`}>
      <div className="container mx-auto p-6">
       
        <div className="flex items-center justify-between mb-6">
          <h1 className={`text-4xl font-bold ${currentTheme.accent}`}>Dashboard</h1>
          <div className="flex space-x-3">
            <Button
              onClick={toggleDarkMode}
              variant="outline"
              className={`border ${currentTheme.outlineButton}`}
            >
              {darkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <Button 
              onClick={handleSignout} 
              variant="outline" 
              className={currentTheme.button}
            >
              <LogOut className="mr-2 h-4 w-4" /> Sign Out
            </Button>
          </div>
        </div>

     
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className={`${currentTheme.card} ${currentTheme.cardBorder} shadow-md border rounded-lg overflow-hidden`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-semibold">My Products</h4>
                <Package className={currentTheme.accent} />
              </div>
              <p className="text-3xl font-bold">{products.length}</p>
            </CardContent>
          </Card>

          <Card className={`${currentTheme.card} ${currentTheme.cardBorder} shadow-md border rounded-lg overflow-hidden`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-semibold">Total Sales</h4>
                <DollarSign className={currentTheme.accent} />
              </div>
              <p className="text-3xl font-bold">{activeUsers}</p>
            </CardContent>
          </Card>

          <Card className={`${currentTheme.card} ${currentTheme.cardBorder} shadow-md border rounded-lg overflow-hidden`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-semibold">Products Sold</h4>
                <Package className={currentTheme.accent} />
              </div>
              <p className="text-3xl font-bold">{totalProducts}</p>
            </CardContent>
          </Card>
        </div>

    
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-3xl font-bold tracking-tight ${currentTheme.text}`}>Products</h2>
            <Button 
              className={currentTheme.button} 
              onClick={() => {
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
              }}
            >
              <Plus className="mr-2 h-4 w-4" /> {showForm ? 'Cancel' : 'Add Product'}
            </Button>
          </div>

        
          {showForm && (
            <Card className={`col-span-full ${currentTheme.card} ${currentTheme.cardBorder} mb-8 border rounded-lg overflow-hidden`}>
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
                          className={`w-full mt-1 p-2 border rounded-md ${darkMode ? 'bg-[#3D3D3D] border-[#4D4D4D] text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                          required
                        />
                      ) : (
                        <input
                          type={type || 'text'}
                          value={newProduct[name]}
                          onChange={(e) => setNewProduct({ ...newProduct, [name]: e.target.value })}
                          className={`w-full mt-1 p-2 border rounded-md ${darkMode ? 'bg-[#3D3D3D] border-[#4D4D4D] text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                          required
                        />
                      )}
                    </div>
                  ))}
                  <Button type="submit" className={currentTheme.button}>
                    {editingProduct ? 'Update Product' : 'Submit'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Product Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.length === 0 ? (
              <Card className={`col-span-full border-dashed border-2 ${currentTheme.card} ${darkMode ? 'border-[#3D3D3D]' : 'border-[#E5E5E5]'}`}>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <Package className={`h-12 w-12 ${currentTheme.accent} opacity-50 mb-4`} />
                  <p className={`text-lg ${currentTheme.textSecondary} text-center`}>
                    No products yet. Click the "Add Product" button to get started.
                  </p>
                </CardContent>
              </Card>
            ) : (
              products.map((product) => (
                <Card key={product.id} className={`${currentTheme.card} ${currentTheme.cardBorder} border rounded-lg overflow-hidden`}>
                  <CardContent className="p-6 space-y-2">
                    {product.image && (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-40 object-cover rounded-md mb-2"
                      />
                    )}
                    <h3 className={`font-semibold text-xl ${currentTheme.text}`}>{product.name}</h3>
                    <p className={`text-sm ${currentTheme.textSecondary}`}>{product.description}</p>
                    <div className={`text-sm ${currentTheme.textSecondary}`}>Category: {product.category}</div>
                    <div className={`text-sm ${currentTheme.textSecondary}`}>Rating: {product.rating} ⭐</div>
                    <div className={`text-sm ${currentTheme.textSecondary}`}>User ID: {product.userId}</div>
                    <div className="flex justify-between items-center pt-2 space-x-2">
                      <span className={`font-bold text-lg ${currentTheme.text}`}>${parseFloat(product.price).toFixed(2)}</span>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          className={`${darkMode ? 'border-blue-400 text-blue-400 hover:bg-blue-900/20' : 'border-blue-600 text-blue-600 hover:bg-blue-50'}`}
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
                        <Button 
                          variant="destructive" 
                          className={darkMode ? 'bg-red-800 hover:bg-red-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}
                          onClick={() => handleDelete(product.id)}
                        >
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
    </div>
  );
}