"use client";

import React, { useState, useEffect } from 'react';
import { Zap, X, Sun, Moon, Menu, Wallet, Circle } from 'lucide-react';
import { CirclePlus } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { WEBSITE_NAME } from '@/utils/constants/navbarConstants';
import { yellow } from '@mui/material/colors';
import Link from 'next/link';

const getProjectTitle = () => WEBSITE_NAME;

const generateGlitchText = (originalText: string) => {
  const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?01010101';
  return originalText
    .split('')
    .map(char => Math.random() > 0.7 ? glitchChars[Math.floor(Math.random() * glitchChars.length)] : char)
    .join('');
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [glitchTitle, setGlitchTitle] = useState(getProjectTitle());
  const { isDarkMode, toggleTheme, themeClasses } = useTheme();
  
  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Features', href: '/features' },
    { name: 'Analytics', href: '/analytics' },
    { name: 'Docs', href: '/docs' },
    { name: 'Community', href: '/community' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const originalTitle = getProjectTitle();
    
    const createGlitch = () => {
      if (Math.random() > 0.95) {
        const glitchedTitle = generateGlitchText(originalTitle);
        setGlitchTitle(glitchedTitle);
        setTimeout(() => setGlitchTitle(originalTitle), 100);
      }
    };

    const interval = setInterval(createGlitch, 2000);
    return () => clearInterval(interval);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobileMenuOpen && !(event.target as Element).closest('nav')) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

return (
  <>
    <nav 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backgroundColor: themeClasses.navbarScrolled,
        backdropFilter: isScrolled ? 'blur(12px)' : 'none',
        borderBottom: isScrolled ? `1px solid ${themeClasses.border}` : 'none',
        boxShadow: isScrolled ? (isDarkMode ? '0 4px 20px rgba(0,0,0,0.5)' : '0 4px 20px rgba(0,0,0,0.1)') : 'none',
        transition: 'all 0.3s ease',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '80px' }}>
          {/* Logo Section */}
          <Link href={'/'} style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
            <div style={{ position: 'relative' }}>
              <Zap 
                style={{ 
                  width: '32px', 
                  height: '32px', 
                  color: themeClasses.textPrimary,
                  transition: 'opacity 0.3s ease'
                }} 
              />
            </div>
            <span 
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: themeClasses.primary,
                fontFamily: 'monospace',
                transition: 'all 0.3s ease'
              }}
            >
              {glitchTitle}
            </span>
          </div>
          </Link>

          {/* Desktop Navigation */}
          <div style={{ display: 'none', alignItems: 'center', gap: '32px' }} className="md:flex">
            {navItems.map((item, index) => (
              <a
                key={item.name}
                href={item.href}
                style={{
                  position: 'relative',
                  color: hoveredItem === index ? themeClasses.textPrimary : themeClasses.textSecondary,
                  transition: 'color 0.3s ease',
                  padding: '8px 12px',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  backgroundColor: hoveredItem === index ? themeClasses.hoverBg : 'transparent',
                }}
                onMouseEnter={() => setHoveredItem(index)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {item.name}
              </a>
            ))}
          </div>
          

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
  
            <Link 
                href="https://sigmoid-2.gitbook.io/sigmoid/"
                style={{ 
                  marginLeft: '8px',
                  textDecoration: 'none',
                  color: themeClasses.textSecondary,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#FFD700';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'inherit';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
         Docs
        </Link>
            <Link 
                href="/assets"
                style={{ 
                  marginLeft: '8px',
                  textDecoration: 'none',
                  color: themeClasses.textSecondary,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#FFD700';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'inherit';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
          Assets
        </Link>
            <Link 
                href="/user"
                style={{ 
                  marginLeft: '8px',
                  textDecoration: 'none',
                  color: themeClasses.textSecondary,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#FFD700';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'inherit';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
          Profile
        </Link>
        <Link href="/add-asset">
            <div                 
              style={{                    
                marginLeft: '8px',                   
                textDecoration: 'none',                   
                color: themeClasses.textSecondary,                   
                cursor: 'pointer',                   
                transition: 'all 0.3s ease',
                display: 'inline-flex',
                alignItems: 'center'                 
              }}                 
              onMouseEnter={(e) => {                   
                e.currentTarget.style.color = '#FFD700';                   
                e.currentTarget.style.transform = 'translateY(-1px)';                 
              }}                 
              onMouseLeave={(e) => {                   
                e.currentTarget.style.color = themeClasses.textSecondary;                   
                e.currentTarget.style.transform = 'translateY(0)';                 
              }}               
            >           
              <CirclePlus size={24} />         
            </div>
          </Link>
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              style={{
                position: 'relative',
                padding: '10px',
                borderRadius: '12px',
                border: `1px solid ${themeClasses.border}`,
                backgroundColor: 'transparent',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = themeClasses.hoverBg;
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.transform = 'scale(1)';
              }}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <div style={{ position: 'relative', width: '20px', height: '20px' }}>
                <Sun 
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '20px',
                    height: '20px',
                    color: themeClasses.textPrimary,
                    opacity: isDarkMode ? 1 : 0,
                    transform: isDarkMode ? 'rotate(90deg) scale(0.75)' : 'rotate(0deg) scale(1)',
                    transition: 'all 0.3s ease',
                  }}
                />
                <Moon 
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '20px',
                    height: '20px',
                    color: themeClasses.textPrimary,
                    opacity: isDarkMode ? 0 : 1,
                    transform: isDarkMode ? 'rotate(0deg) scale(1)' : 'rotate(-90deg) scale(0.75)',
                    transition: 'all 0.3s ease',
                  }}
                />
              </div>
            </button>

       
            <div style={{ marginLeft: '8px' }}>
              <ConnectButton />
            </div>
          </div>
        </div>
        
      </div>

      {/* Scan Line Effect */}
      <div 
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '1px',
          background: themeClasses.scanLine,
          overflow: 'hidden',
        }}
      >
        <div 
          style={{
            width: '80px',
            height: '100%',
            background: isDarkMode 
              ? 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)'
              : 'linear-gradient(90deg, transparent, rgba(0,0,0,0.6), transparent)',
            animation: 'scan 3s linear infinite',
          }}
        />
      </div>
    </nav>

    {/* Backdrop for mobile menu */}
    {isMobileMenuOpen && (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 30,
          opacity: isMobileMenuOpen ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
        onClick={() => setIsMobileMenuOpen(false)}
      />
    )}

    {/* Spacer to prevent content from going under fixed navbar */}
    <div style={{ height: '80px' }} />

    <style jsx>{`
      @keyframes scan {
        0% { transform: translateX(-100px); }
        100% { transform: translateX(calc(100vw + 100px)); }
      }
      
      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `}</style>
  </>
);
}

export default Navbar;