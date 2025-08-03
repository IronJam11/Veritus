// contexts/ThemeContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  themeClasses: {
    // CSS values for inline styles
    background: string;
    textPrimary: string;
    textSecondary: string;
    paper: string;
    border: string;
    primary: string;
    secondary: string;
    hoverBg: string;
    navbarBg: string;
    navbarScrolled: string;
    mobileMenu: string;
    scanLine: string;
    
    // Tailwind classes for className usage
    bg: string;
    text: string;
    textMuted: string;
    cardBg: string;
    accent: string;
    walletConnected: string;
    walletDisconnected: string;
    mobileButton: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // Initialize theme from localStorage on client side
  useEffect(() => {
    setIsClient(true);
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
      localStorage.setItem('theme', prefersDark ? 'dark' : 'light');
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
      
      // Update document class for global styles
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      }
    }
  }, [isDarkMode, isClient]);

  const toggleTheme = () => {
    console.log('Theme toggled:', isDarkMode ? 'dark -> light' : 'light -> dark');
    setIsDarkMode(prev => !prev);
  };

  const themeClasses = {
    // CSS values for inline styles - Clean white/grey/black palette
    background: isDarkMode ? '#000000' : '#ffffff',
    textPrimary: isDarkMode ? '#ffffff' : '#000000',
    textSecondary: isDarkMode ? '#a3a3a3' : '#525252', // neutral-400 : neutral-600
    paper: isDarkMode ? 'rgba(23, 23, 23, 0.95)' : 'rgba(255, 255, 255, 0.95)', // neutral-900 : white
    border: isDarkMode ? '#404040' : '#d4d4d4', // neutral-700 : neutral-300
    primary: isDarkMode ? '#ffffff' : '#000000', // Pure contrast
    secondary: isDarkMode ? '#737373' : '#737373', // neutral-500 for both
    hoverBg: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
    navbarBg: 'transparent',
    navbarScrolled: isDarkMode ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    mobileMenu: isDarkMode ? 'rgba(0, 0, 0, 0.98)' : 'rgba(255, 255, 255, 0.98)',
    scanLine: isDarkMode 
      ? 'linear-gradient(to right, transparent, rgba(255, 255, 255, 0.15), transparent)' 
      : 'linear-gradient(to right, transparent, rgba(0, 0, 0, 0.15), transparent)',
    
    // Tailwind classes for className usage
    bg: isDarkMode ? 'bg-black' : 'bg-white',
    text: isDarkMode ? 'text-white' : 'text-black',
    textMuted: isDarkMode ? 'text-neutral-400' : 'text-neutral-600',
    cardBg: isDarkMode ? 'from-neutral-900 to-neutral-800' : 'from-neutral-50 to-neutral-100',
    accent: isDarkMode ? 'from-white to-neutral-300' : 'from-black to-neutral-700',
    
    // Wallet button classes - Clean and elegant
    walletConnected: isDarkMode
      ? 'bg-white text-black border border-white hover:bg-neutral-200'
      : 'bg-black text-white border border-black hover:bg-neutral-800',
    walletDisconnected: isDarkMode
      ? 'bg-transparent text-white border border-neutral-600 hover:border-white hover:bg-neutral-900'
      : 'bg-transparent text-black border border-neutral-400 hover:border-black hover:bg-neutral-50',
    
    // Mobile button
    mobileButton: isDarkMode 
      ? 'bg-neutral-900/80 border-neutral-700 hover:border-neutral-500' 
      : 'bg-neutral-100/80 border-neutral-300 hover:border-neutral-500',
  };

  const value = {
    isDarkMode,
    toggleTheme,
    themeClasses,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};