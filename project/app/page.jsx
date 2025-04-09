'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  ShoppingBag, 
  LogIn, 
  UserPlus, 
  BarChart3, 
  Package, 
  Layers, 
  TrendingUp, 
  Moon, 
  Sun,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  
  // Black and white color theme with white cards in dark mode
  const theme = {
    light: {
      background: 'bg-white',
      text: 'text-[#333333]',
      textSecondary: 'text-[#6C757D]',
      accent: 'text-[#333333]',
      button: 'bg-[#333333] hover:bg-[#000000] text-white',
      outlineButton: 'border-[#333333] text-[#333333] hover:bg-[#F0F0F0]',
      ghostButton: 'text-[#333333] hover:bg-[#F0F0F0]',
    },
    dark: {
      background: 'bg-[#1A1A1A]',
      text: 'text-white',
      textSecondary: 'text-[#B2B2B2]',
      accent: 'text-white',
      button: 'bg-[#333333] hover:bg-[#000000] text-white',
      outlineButton: 'border-white text-white hover:bg-[#333333]',
      ghostButton: 'text-white hover:bg-[#333333]',
    }
  };

  // Select current theme based on mode
  const currentTheme = darkMode ? theme.dark : theme.light;

  useEffect(() => {
    // Apply dark mode to document body only
    if (darkMode) {
      document.body.classList.add('bg-[#1A1A1A]');
      document.body.classList.remove('bg-white');
    } else {
      document.body.classList.add('bg-white');
      document.body.classList.remove('bg-[#1A1A1A]');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      }
    }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    show: { 
      opacity: 1,
      transition: {
        duration: 0.8,
      }
    }
  };

  const features = [
    { 
      icon: <BarChart3 className="h-6 w-6" />, 
      title: "Analytics", 
      description: "Track product performance in real-time" 
    },
    { 
      icon: <Package className="h-6 w-6" />, 
      title: "Inventory", 
      description: "Manage stock levels efficiently" 
    },
    { 
      icon: <Layers className="h-6 w-6" />, 
      title: "Categories", 
      description: "Organize products with custom categories" 
    },
    { 
      icon: <TrendingUp className="h-6 w-6" />, 
      title: "Growth", 
      description: "Scale your business with powerful insights" 
    },
  ];

  return (
    <div className={`min-h-screen ${currentTheme.background} transition-colors duration-300`}>
      {/* Dark mode toggle */}
      <div className="absolute top-4 right-4">
        <Button
          onClick={toggleDarkMode}
          variant="ghost"
          size="sm"
          className={currentTheme.ghostButton}
        >
          {darkMode ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
      </div>

      <motion.div 
        className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-4 text-center"
        initial="hidden"
        animate="show"
        variants={container}
      >
        <motion.div 
          className="relative"
          variants={item}
          whileHover={{ rotate: 360, transition: { duration: 1 } }}
        >
          <ShoppingBag className={`h-20 w-20 ${currentTheme.accent} mb-8`} />
          <motion.div 
            className="absolute -top-2 -right-2 bg-red-500 rounded-full h-6 w-6 flex items-center justify-center text-white text-xs font-bold"
            animate={{ 
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "loop"
            }}
          >
            NEW
          </motion.div>
        </motion.div>

        <motion.h1 
          className={`text-4xl font-bold tracking-tighter sm:text-6xl ${currentTheme.text}`}
          variants={item}
        >
          Product Management
        </motion.h1>

        <motion.p 
          className={`mt-4 ${currentTheme.textSecondary} sm:text-xl max-w-xl`}
          variants={item}
        >
          Streamline your product operations with our powerful management system. 
          Organize, track, and grow your business with ease.
        </motion.p>

        <motion.div 
          className="mt-12 flex flex-wrap gap-4 justify-center"
          variants={item}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              asChild 
              size="lg"
              className={`${currentTheme.button} group`}
            >
              <Link href="/dashboard" className="flex items-center gap-2">
                View Dashboard
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              variant="outline" 
              size="lg" 
              asChild
              className={`${currentTheme.outlineButton}`}
            >
              <Link href="/products">View Products</Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Features section */}
        <motion.div 
          className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl"
          variants={fadeIn}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className={`p-6 rounded-lg border ${darkMode ? 'border-gray-700 bg-[#252525]' : 'border-gray-200 bg-gray-50'} text-left transition-all duration-300 hover:shadow-lg`}
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + (index * 0.1) }}
            >
              <div className={`${currentTheme.accent} mb-3`}>{feature.icon}</div>
              <h3 className={`font-bold text-lg ${currentTheme.text}`}>{feature.title}</h3>
              <p className={`${currentTheme.textSecondary} text-sm mt-1`}>{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
           
        {/* Authentication buttons */}
        <motion.div 
          className="mt-12 flex gap-4"
          variants={item}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              variant="ghost" 
              size="sm" 
              asChild 
              className={`flex items-center gap-2 ${currentTheme.ghostButton}`}
            >
              <Link href="/signin">
                <LogIn className="h-4 w-4" />
                <span>Sign In</span>
              </Link>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              variant="ghost" 
              size="sm" 
              asChild 
              className={`flex items-center gap-2 ${currentTheme.ghostButton}`}
            >
              <Link href="/signup">
                <UserPlus className="h-4 w-4" />
                <span>Sign Up</span>
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}