'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Package, 
  Search, 
  Filter, 
  Star, 
  DollarSign, 
  Moon, 
  Sun, 
  ShoppingCart,
  Eye 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [rating, setRating] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Black and white color theme
  const theme = {
    light: {
      background: 'bg-white',
      card: 'bg-white',
      cardBorder: 'border-[#E5E5E5]',
      primary: 'bg-[#333333]',
      primaryHover: 'hover:bg-black',
      text: 'text-[#333333]',
      textSecondary: 'text-[#6C757D]',
      accent: 'text-[#333333]',
      input: 'border-[#E5E5E5] focus-visible:ring-[#333333]',
      button: 'bg-[#333333] hover:bg-black text-white',
      outlineButton: 'border-[#333333] text-[#333333] hover:bg-[#F0F0F0]',
      emptyCard: 'border-dashed border-2 border-[#E5E5E5] bg-[#F9F9F9]'
    },
    dark: {
      background: 'bg-[#1A1A1A]',
      card: 'bg-white',
      cardBorder: 'border-[#E5E5E5]',
      primary: 'bg-[#333333]',
      primaryHover: 'hover:bg-black',
      text: 'text-white',
      textSecondary: 'text-[#B2B2B2]',
      accent: 'text-white',
      input: 'border-[#333333] focus-visible:ring-white bg-white text-black',
      button: 'bg-[#333333] hover:bg-black text-white',
      outlineButton: 'border-white text-white hover:bg-[#333333]',
      emptyCard: 'border-dashed border-2 border-[#E5E5E5] bg-white'
    }
  };

  // Select current theme based on mode
  const currentTheme = darkMode ? theme.dark : theme.light;

  useEffect(() => {
    // Apply dark mode to document body
    if (darkMode) {
      document.body.classList.add('bg-[#1A1A1A]');
      document.body.classList.remove('bg-white');
    } else {
      document.body.classList.add('bg-white');
      document.body.classList.remove('bg-[#1A1A1A]');
    }

    // Fetch products
    fetch('/api/product')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name?.toLowerCase().includes(search.toLowerCase()) ||
      product.description?.toLowerCase().includes(search.toLowerCase());

    const matchesPrice =
      (minPrice === '' || parseFloat(product.price) >= parseFloat(minPrice)) &&
      (maxPrice === '' || parseFloat(product.price) <= parseFloat(maxPrice));

    const matchesRating =
      rating === '' || parseFloat(product.rating) >= parseFloat(rating);

    return matchesSearch && matchesPrice && matchesRating;
  });

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
      }
    }
  };

  const filterContainer = {
    hidden: { height: 0, opacity: 0 },
    show: { 
      height: 'auto', 
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <div className={`min-h-screen ${currentTheme.background} transition-colors duration-300 p-6`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-[#333333]'}`}>
            All Products
          </h1>
          
          <Button
            onClick={toggleDarkMode}
            variant="ghost"
            size="sm"
            className={darkMode ? 'text-white hover:bg-[#333333]' : 'text-[#333333] hover:bg-[#F0F0F0]'}
          >
            {darkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Search + Filter Toggle */}
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Search by name or description"
              className={`pl-10 ${currentTheme.input}`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <Button 
            variant="outline" 
            onClick={toggleFilters}
            className={`${darkMode ? 'border-white text-white' : 'border-[#333333] text-[#333333]'} flex items-center gap-2`}
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Filter Options */}
        <AnimatePresence>
          {showFilters && (
            <motion.div 
              className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 overflow-hidden"
              variants={filterContainer}
              initial="hidden"
              animate="show"
              exit="hidden"
            >
              <div className="relative">
                <Input
                  type="number"
                  placeholder="Min Price"
                  className={`pl-10 ${currentTheme.input}`}
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="Max Price"
                  className={`pl-10 ${currentTheme.input}`}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="Min Rating (0-5)"
                  min={0}
                  max={5}
                  className={`pl-10 ${currentTheme.input}`}
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                />
                <Star className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats */}
        <div className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Showing {filteredProducts.length} of {products.length} products
        </div>

        {/* Product List */}
        <motion.div 
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {filteredProducts.length === 0 ? (
            <Card className={`col-span-full ${currentTheme.emptyCard} shadow-sm`}>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Package className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg text-center text-gray-500">No products found. Try adjusting your filters.</p>
              </CardContent>
            </Card>
          ) : (
            filteredProducts.map((product) => (
              <motion.div key={product.id} variants={item}>
                <Card
                  className={`${currentTheme.card} border ${currentTheme.cardBorder} shadow-md h-full hover:shadow-lg transition-shadow duration-300`}
                >
                  <CardContent className="p-0 h-full flex flex-col">
                    {product.image ? (
                      <div className="relative group">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-48 object-cover rounded-t-md"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <Button variant="outline" className="bg-white text-black border-white hover:bg-gray-100">
                            <Eye className="h-4 w-4 mr-2" />
                            Quick View
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="h-48 bg-gray-100 flex items-center justify-center rounded-t-md">
                        <Package className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex-grow">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-xl text-[#333333]">{product.name}</h3>
                          <div className="flex items-center text-yellow-500 bg-yellow-50 rounded-full px-2 py-1 text-xs">
                            <Star className="h-3 w-3 mr-1 inline" fill="currentColor" />
                            {product.rating}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                        <div className="text-xs text-gray-500 mb-4">Category: {product.category}</div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-auto">
                        <span className="font-bold text-lg text-[#333333]">
                          ${parseFloat(product.price).toFixed(2)}
                        </span>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border-[#333333] text-[#333333] hover:bg-[#F0F0F0]"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm"
                            className="bg-[#333333] hover:bg-black text-white"
                          >
                            <ShoppingCart className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
}