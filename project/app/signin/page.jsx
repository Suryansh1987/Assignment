'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Moon, Sun, LogIn, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(false);


  const theme = {
    light: {
      background: 'bg-white',
      card: 'bg-white',
      cardBorder: 'border-[#E5E5E5]',
      cardShadow: 'shadow-lg',
      heading: 'text-[#333333]',
      text: 'text-[#333333]',
      textSecondary: 'text-[#6C757D]',
      input: 'bg-white border-gray-300 text-[#333333] focus:ring-[#333333] focus:border-[#333333]',
      button: 'bg-[#333333] hover:bg-black text-white',
      buttonInverse: 'bg-white border border-[#333333] text-[#333333] hover:bg-gray-100',
      link: 'text-[#333333] hover:text-black',
      error: 'bg-red-50 text-red-500 border border-red-200',
      loadingOverlay: 'bg-white bg-opacity-70'
    },
    dark: {
      background: 'bg-[#1A1A1A]',
      card: 'bg-[#2D2D2D]',
      cardBorder: 'border-[#3D3D3D]',
      cardShadow: 'shadow-2xl shadow-black/30',
      heading: 'text-white',
      text: 'text-white',
      textSecondary: 'text-[#B2B2B2]',
      input: 'bg-[#3D3D3D] border-[#4D4D4D] text-white focus:ring-white focus:border-white',
      button: 'bg-[#333333] hover:bg-black text-white',
      buttonInverse: 'bg-white border border-white text-[#333333] hover:bg-gray-100',
      link: 'text-white hover:text-gray-200',
      error: 'bg-red-900/30 text-red-300 border border-red-900/50',
      loadingOverlay: 'bg-[#1A1A1A] bg-opacity-70'
    }
  };


  const currentTheme = darkMode ? theme.dark : theme.light;

  useEffect(() => {
  
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to sign in');
      }

  
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const formItemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${currentTheme.background} transition-colors duration-300 p-6`}>
  
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-full ${darkMode ? 'bg-[#3D3D3D] text-white' : 'bg-gray-100 text-[#333333]'} 
            hover:opacity-80 transition-opacity`}
        >
          {darkMode ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>
      </div>

      <motion.div
        className={`${currentTheme.card} ${currentTheme.cardBorder} border ${currentTheme.cardShadow} 
          p-8 rounded-xl w-full max-w-md overflow-hidden`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={formItemVariants} className="flex justify-center mb-8">
            <div className={`p-3 rounded-full ${darkMode ? 'bg-[#3D3D3D]' : 'bg-gray-100'}`}>
              <LogIn className={`h-8 w-8 ${currentTheme.heading}`} />
            </div>
          </motion.div>

          <motion.h2 
            variants={formItemVariants}
            className={`text-3xl font-bold mb-6 ${currentTheme.heading} text-center`}
          >
            Welcome Back
          </motion.h2>
          
          {error && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className={`${currentTheme.error} p-3 rounded mb-6 flex items-center`}
            >
              <AlertCircle className="mr-2 h-5 w-5 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div variants={formItemVariants}>
              <label htmlFor="email" className={`block text-sm font-medium ${currentTheme.textSecondary} mb-1`}>
                Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={`w-full pl-10 pr-4 py-2 rounded-md ${currentTheme.input}
                    transition-all duration-200 outline-none`}
                  placeholder="your@email.com"
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </motion.div>
            
            <motion.div variants={formItemVariants}>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className={`block text-sm font-medium ${currentTheme.textSecondary} mb-1`}>
                  Password
                </label>
                <Link href="/forgot-password" className={`text-xs ${currentTheme.link}`}>
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={`w-full pl-10 pr-12 py-2 rounded-md ${currentTheme.input}
                    transition-all duration-200 outline-none`}
                  placeholder="Enter your password"
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </motion.div>
            
            <motion.div variants={formItemVariants} className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full ${currentTheme.button} font-medium py-2.5 px-4 rounded-md
                  focus:outline-none transition duration-200 disabled:opacity-50  
                  flex items-center justify-center`}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Sign In <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                )}
              </button>
            </motion.div>
          </form>
          
          <motion.div 
            variants={formItemVariants}
            className="mt-6 text-center"
          >
            <span className={currentTheme.textSecondary}>Don't have an account? </span>
            <Link 
              href="/signup" 
              className={`${currentTheme.link} font-medium`}
            >
              Sign Up
            </Link>
          </motion.div>
        </motion.div>

        {isLoading && (
          <div className={`absolute inset-0 ${currentTheme.loadingOverlay} 
            flex items-center justify-center backdrop-blur-sm`}>
            <div className="w-12 h-12 rounded-full border-4 border-gray-300 border-t-black animate-spin"></div>
          </div>
        )}
      </motion.div>
    </div>
  );
}