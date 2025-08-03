"use client";

import React, { useState, useEffect } from 'react';
import { ChevronDown, Zap, Shield, Rocket, Users, BarChart3, TrendingUp, ArrowRight, Play, Star, Check, X, Menu, Wallet, Circle, Sun, Moon, Code, Database, Cloud, Globe, Award, Target, Timer, Layers, } from 'lucide-react';

import { faqs } from '@/utils/constants/landing-page/faqs';
import { features } from '@/utils/constants/landing-page/features';
import { FlowGraph } from '@/utils/constants/landing-page/flowGraph';
import { testimonials } from '@/utils/constants/landing-page/testimonials';
import { technologies } from '@/utils/constants/landing-page/technologies';
import { stats } from '@/utils/constants/landing-page/stats';



import { WEBSITE_NAME } from '@/utils/constants/navbarConstants';
import { useTheme } from '@/context/ThemeContext';
// import Trading3DChart from '@/utils/constants/landing-page/Trading3DChart';
import Link from 'next/link';


const getProjectTitle = () => WEBSITE_NAME;

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [mouseTrail, setMouseTrail] = useState<{ x: number; y: number; id: number }[]>([]);
  const [glitchText, setGlitchText] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [typedText, setTypedText] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const { isDarkMode: darkMode, toggleTheme, themeClasses } = useTheme();


  const words = ['Future', 'Innovation', 'Excellence', 'Success'];
  const currentWord = words[currentWordIndex];

  useEffect(() => {
    setIsVisible(true);

    let timeout: NodeJS.Timeout;
    if (typedText.length < currentWord.length) {
      timeout = setTimeout(() => {
        setTypedText(currentWord.slice(0, typedText.length + 1));
      }, 150);
    } else {
      timeout = setTimeout(() => {
        setTypedText('');
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
      }, 2000);
    }

    return () => clearTimeout(timeout);
  }, [typedText, currentWord]);

  useEffect(() => {
    const crypticChars = '01010101010101';
    const generateGlitch = () => {
      return Array.from({ length: 20 }, () =>
        crypticChars[Math.floor(Math.random() * crypticChars.length)]
      ).join('');
    };

    const handleMouseMove = (e: any) => {
      setMousePosition({ x: e.clientX, y: e.clientY });

      setMouseTrail(prev => {
        const newTrail = [...prev, { x: e.clientX, y: e.clientY, id: Date.now() }];
        return newTrail.slice(-8);
      });
      if (Math.random() > 0.7) {
        setGlitchText(generateGlitch());
        setTimeout(() => setGlitchText(''), 150);
      }
    };

    const handleScroll = () => setScrollY(window.scrollY);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={`min-h-screen ${themeClasses.bg} ${themeClasses.text} overflow-hidden transition-all duration-500`}>
      <div className="fixed inset-0 pointer-events-none z-40">
        {mouseTrail.map((point, index) => (
          <div
            key={point.id}
            className={`absolute w-2 h-2 ${isDarkMode ? 'bg-white' : 'bg-black'} rounded-full animate-ping`}
            style={{
              left: point.x - 4,
              top: point.y - 4,
              opacity: (index + 1) / mouseTrail.length * 0.7,
              animationDelay: `${index * 0.1}s`,
              animationDuration: '0.8s'
            }}
          />
        ))}

        <div
          className={`fixed w-6 h-6 border ${isDarkMode ? 'border-white' : 'border-black'} rounded-full pointer-events-none transition-all duration-100 ease-out`}
          style={{
            left: mousePosition.x - 12,
            top: mousePosition.y - 12,
            transform: `scale(${isVisible ? 1 : 0})`,
            boxShadow: `0 0 20px ${isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)'}`
          }}
        />

        {glitchText && (
          <div
            className={`fixed text-xs ${themeClasses.textMuted} font-mono animate-pulse pointer-events-none`}
            style={{
              left: mousePosition.x + 20,
              top: mousePosition.y - 10,
              filter: 'blur(0.5px)',
              textShadow: `0 0 10px ${isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)'}`
            }}
          >
            {glitchText}
          </div>
        )}

        <div
          className={`fixed w-px h-screen bg-gradient-to-b from-transparent ${isDarkMode ? 'via-white' : 'via-black'} to-transparent opacity-10 animate-pulse`}
          style={{
            left: mousePosition.x,
            animationDuration: '2s'
          }}
        />
        <div
          className={`fixed w-screen h-px bg-gradient-to-r from-transparent ${isDarkMode ? 'via-white' : 'via-black'} to-transparent opacity-10 animate-pulse`}
          style={{
            top: mousePosition.y,
            animationDuration: '2s'
          }}
        />
      </div>

      {/* Enhanced Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute -top-40 -right-40 w-80 h-80 ${isDarkMode ? 'bg-neutral-300/5' : 'bg-neutral-600/8'} rounded-full blur-3xl animate-pulse`} />
          <div className={`absolute -bottom-40 -left-40 w-80 h-80 ${isDarkMode ? 'bg-neutral-500/8' : 'bg-neutral-400/10'} rounded-full blur-3xl animate-pulse`} style={{ animationDelay: '1s' }} />
          <div className={`absolute top-1/2 left-1/2 w-40 h-40 ${isDarkMode ? 'bg-neutral-400/6' : 'bg-neutral-500/6'} rounded-full blur-2xl animate-bounce`} style={{ animationDelay: '2s' }} />

          {/* Floating particles */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-1 h-1 ${isDarkMode ? 'bg-white' : 'bg-black'} rounded-full animate-pulse`}
              style={{
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                animationDuration: Math.random() * 3 + 2 + 's',
                animationDelay: Math.random() * 2 + 's'
              }}
            />
          ))}
        </div>

        <div className={`relative z-10 text-center max-w-6xl transition-all duration-1000 ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-12'}`}>
          <div className="mb-6">
            <h1 className={`text-6xl md:text-8xl font-bold mb-2 bg-gradient-to-r from-current ${isDarkMode ? 'via-neutral-400 to-neutral-500' : 'via-neutral-600 to-neutral-700'} bg-clip-text text-transparent`}>
              Build the
            </h1>
            <h1 className={`text-6xl md:text-8xl font-bold bg-gradient-to-r from-current ${isDarkMode ? 'to-neutral-500' : 'to-neutral-600'} bg-clip-text text-transparent`}>
              {typedText}
              <span className="animate-pulse">|</span>
            </h1>
          </div>

          <p className={`text-xl md:text-2xl ${themeClasses.textMuted} mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in-up`} style={{ animationDelay: '0.5s' }}>
            Transform your ideas into reality with our cutting-edge platform. Experience the next generation of digital innovation that adapts to your needs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12" style={{ animationDelay: '1s' }}>
            <button className={`group border ${isDarkMode ? 'border-neutral-600 hover:border-white hover:bg-white hover:text-black' : 'border-neutral-400 hover:border-black hover:bg-black hover:text-white'} px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-2`}>
              <Link href="/assets">
              Get started
              </Link>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button className={`group border ${isDarkMode ? 'border-neutral-600 hover:border-white hover:bg-white hover:text-black' : 'border-neutral-400 hover:border-black hover:bg-black hover:text-white'} px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-2`}>
              <Play className="w-5 h-5" />
              <Link href="https://www.youtube.com/watch?v=Hbvsc5royCU">
              Watch Demo
              </Link>
            </button>
            
          </div>
          

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group animate-fade-in-up" style={{ animationDelay: `${1.5 + index * 0.1}s` }}>
                <div className={`${themeClasses.textMuted} group-hover:text-current transition-colors duration-300 mb-2 flex justify-center`}>
                  {stat.icon}
                </div>
                <div className="text-2xl md:text-3xl font-bold mb-1">{stat.value}</div>
                <div className={`text-sm ${themeClasses.textMuted}`}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <ChevronDown className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 w-8 h-8 animate-bounce ${themeClasses.textMuted}`} />
      </section>
      {/* Trading Dashboard Section */}
      <section className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">

          </div>

          <div className="relative">
            <div className={`absolute inset-0 bg-gradient-to-r ${isDarkMode ? 'from-neutral-500/10 to-neutral-400/10' : 'from-neutral-300/20 to-neutral-400/20'} rounded-3xl blur-xl`} />
            <div className="relative z-10">
              {/* <Trading3DChart isDarkMode={darkMode} /> */}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section id="features" className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-12'}`}>
            <h2 className={`text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-current ${isDarkMode ? 'to-neutral-400' : 'to-neutral-600'} bg-clip-text text-transparent`}>
              Powerful Features
            </h2>
            <p className={`text-xl ${themeClasses.textMuted} max-w-2xl mx-auto`}>
              Everything you need to build, scale, and succeed in the digital age
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group p-8 rounded-2xl bg-gradient-to-br ${themeClasses.cardBg} border ${isDarkMode ? 'border-neutral-700 hover:border-white hover:shadow-2xl hover:shadow-white/10' : 'border-neutral-300 hover:border-black hover:shadow-2xl hover:shadow-black/10'} transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-12'} cursor-pointer`}
                style={{ animationDelay: `${index * 0.2}s` }}
                onMouseEnter={() => setActiveCard(index)}
                onMouseLeave={() => setActiveCard(null)}
              >
                <div className={`${isDarkMode ? 'text-white group-hover:text-neutral-300' : 'text-black group-hover:text-neutral-700'} mb-4 transition-all duration-300 ${activeCard === index ? 'scale-110 rotate-12' : ''}`}>
                  {feature.icon}
                </div>
                <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? 'group-hover:text-white' : 'group-hover:text-black'} transition-colors`}>
                  {feature.title}
                </h3>
                <p className={`${themeClasses.textMuted} ${isDarkMode ? 'group-hover:text-neutral-300' : 'group-hover:text-neutral-600'} transition-colors`}>
                  {feature.description}
                </p>
                <div className={`mt-4 w-0 h-0.5 ${isDarkMode ? 'bg-white' : 'bg-black'} group-hover:w-full transition-all duration-500`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Technologies Section */}
      <section className={`py-24 px-6 ${isDarkMode ? 'bg-neutral-900/30' : 'bg-neutral-100/50'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-current ${isDarkMode ? 'to-neutral-400' : 'to-neutral-600'} bg-clip-text text-transparent`}>
              Cutting-Edge Technology
            </h2>
            <p className={`text-xl ${themeClasses.textMuted} max-w-2xl mx-auto`}>
              Built on the foundation of tomorrow's technology stack
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {technologies.map((tech, index) => (
              <div
                key={index}
                className={`group text-center p-8 rounded-2xl bg-gradient-to-br ${themeClasses.cardBg} border ${isDarkMode ? 'border-neutral-700 hover:border-white' : 'border-neutral-300 hover:border-black'} transition-all duration-500 transform hover:scale-105 hover:rotate-1`}
              >
                <div className={`${themeClasses.textMuted} group-hover:text-current mb-4 flex justify-center transition-all duration-300 group-hover:scale-110`}>
                  {tech.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{tech.name}</h3>
                <p className={`text-sm ${themeClasses.textMuted}`}>{tech.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Graph/Flow Section */}
      <section id="analytics" className={`py-24 px-6 bg-gradient-to-b ${isDarkMode ? 'from-neutral-900/50 to-black' : 'from-neutral-200/50 to-white'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-current ${isDarkMode ? 'to-neutral-400' : 'to-neutral-600'} bg-clip-text text-transparent`}>
              Visualize Your Data
            </h2>
            <p className={`text-xl ${themeClasses.textMuted} max-w-2xl mx-auto`}>
              Transform complex data into beautiful, interactive visualizations that drive decisions
            </p>
          </div>

          <div className="relative">
            <div className={`absolute inset-0 bg-gradient-to-r ${isDarkMode ? 'from-neutral-500/10 to-neutral-400/10' : 'from-neutral-300/20 to-neutral-400/20'} rounded-3xl blur-xl`} />
            <div className="relative z-10">
              <FlowGraph />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className={`text-center p-6 rounded-xl bg-gradient-to-br ${themeClasses.cardBg} backdrop-blur-sm border ${isDarkMode ? 'border-neutral-700 hover:border-white' : 'border-neutral-300 hover:border-black'} transition-all duration-300 transform hover:scale-105 group`}>
              <div className="text-3xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">99.9%</div>
              <div className={themeClasses.textMuted}>Uptime Guarantee</div>
            </div>
            <div className={`text-center p-6 rounded-xl bg-gradient-to-br ${themeClasses.cardBg} backdrop-blur-sm border ${isDarkMode ? 'border-neutral-700 hover:border-white' : 'border-neutral-300 hover:border-black'} transition-all duration-300 transform hover:scale-105 group`}>
              <div className="text-3xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">10M+</div>
              <div className={themeClasses.textMuted}>Data Points Processed</div>
            </div>
            <div className={`text-center p-6 rounded-xl bg-gradient-to-br ${themeClasses.cardBg} backdrop-blur-sm border ${isDarkMode ? 'border-neutral-700 hover:border-white' : 'border-neutral-300 hover:border-black'} transition-all duration-300 transform hover:scale-105 group`}>
              <div className="text-3xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">5min</div>
              <div className={themeClasses.textMuted}>Setup Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* New Testimonials Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-current ${isDarkMode ? 'to-neutral-400' : 'to-neutral-600'} bg-clip-text text-transparent`}>
              Trusted by Leaders
            </h2>
            <p className={`text-xl ${themeClasses.textMuted} max-w-2xl mx-auto`}>
              See what industry experts say about our platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`p-8 rounded-2xl bg-gradient-to-br ${themeClasses.cardBg} border ${isDarkMode ? 'border-neutral-700 hover:border-white hover:shadow-2xl hover:shadow-white/10' : 'border-neutral-300 hover:border-black hover:shadow-2xl hover:shadow-black/10'} transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 group`}
              >
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${isDarkMode ? 'text-neutral-300' : 'text-neutral-600'} fill-current`} />
                  ))}
                </div>
                <p className={`${themeClasses.textMuted} mb-6 italic group-hover:text-current transition-colors`}>
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className={`text-sm ${themeClasses.textMuted}`}>{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced FAQ Section */}
      <section id="docs" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-current ${isDarkMode ? 'to-neutral-400' : 'to-neutral-600'} bg-clip-text text-transparent`}>
              Frequently Asked Questions
            </h2>
            <p className={`text-xl ${themeClasses.textMuted}`}>
              Get answers to common questions about our platform
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`border ${isDarkMode ? 'border-neutral-700' : 'border-neutral-300'} rounded-2xl overflow-hidden bg-gradient-to-r ${themeClasses.cardBg} backdrop-blur-sm ${isDarkMode ? 'hover:border-white hover:shadow-lg hover:shadow-white/10' : 'hover:border-black hover:shadow-lg hover:shadow-black/10'} transition-all duration-300 group`}
              >
                <button
                  className={`w-full p-6 text-left flex justify-between items-center ${isDarkMode ? 'hover:bg-neutral-800/50' : 'hover:bg-neutral-200/50'} transition-colors group-hover:bg-opacity-70`}
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span className="font-semibold text-lg group-hover:translate-x-2 transition-transform duration-300">{faq.question}</span>
                  <ChevronDown className={`w-6 h-6 transition-all duration-300 group-hover:scale-110 ${openFaq === index ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === index && (
                  <div className={`px-6 pb-6 ${themeClasses.textMuted} animate-in slide-in-from-top-2 duration-300`}>
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section id="community" className="py-24 px-6 relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-r ${isDarkMode ? 'from-white/5 to-neutral-500/10' : 'from-black/5 to-neutral-400/10'}`} />
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-px h-px ${isDarkMode ? 'bg-white' : 'bg-black'} animate-pulse`}
              style={{
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                animationDuration: Math.random() * 4 + 2 + 's',
                animationDelay: Math.random() * 2 + 's'
              }}
            />
          ))}
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className={`text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-current ${isDarkMode ? 'to-neutral-400' : 'to-neutral-600'} bg-clip-text text-transparent`}>
            Ready to Transform?
          </h2>
          <p className={`text-xl ${themeClasses.textMuted} mb-8 max-w-2xl mx-auto`}>
            Join thousands of companies already using our platform to build the future. Start your journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button className={`group bg-gradient-to-r ${themeClasses.accent} ${isDarkMode ? 'text-black hover:from-neutral-200 hover:to-neutral-400' : 'text-white hover:from-neutral-800 hover:to-neutral-900'} px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${isDarkMode ? 'hover:shadow-white/25' : 'hover:shadow-black/25'} flex items-center justify-center gap-2`}>
              Start Your Journey
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className={`border ${isDarkMode ? 'border-neutral-600 hover:border-white hover:bg-white hover:text-black' : 'border-neutral-400 hover:border-black hover:bg-black hover:text-white'} px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105`}>
              Contact Sales
            </button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-sm font-medium">Trusted by 50,000+ users</div>
            <div className="w-px h-4 bg-current opacity-30" />
            <div className="text-sm font-medium">SOC 2 Compliant</div>
            <div className="w-px h-4 bg-current opacity-30" />
            <div className="text-sm font-medium">99.9% Uptime SLA</div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className={`py-12 px-6 border-t ${isDarkMode ? 'border-neutral-700' : 'border-neutral-300'} relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-12 gap-4 h-full">
            {[...Array(48)].map((_, i) => (
              <div key={i} className={`${isDarkMode ? 'bg-white' : 'bg-black'} animate-pulse`} style={{ animationDelay: `${i * 0.1}s`, animationDuration: '3s' }} />
            ))}
          </div>
        </div>
        <div className={`max-w-6xl mx-auto text-center ${themeClasses.textMuted} relative z-10`}>
          <div className="mb-6">
            <h3 className={`text-2xl font-bold mb-2 bg-gradient-to-r from-current ${isDarkMode ? 'to-neutral-500' : 'to-neutral-600'} bg-clip-text text-transparent`}>
              {getProjectTitle()}
            </h3>
            <p className="text-sm">Powering the next generation of digital experiences</p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-6 mb-6 text-sm">
            <a href="#" className="hover:text-current transition-colors duration-300 hover:underline">Privacy Policy</a>
            <div className="w-px h-4 bg-current opacity-30" />
            <a href="#" className="hover:text-current transition-colors duration-300 hover:underline">Terms of Service</a>
            <div className="w-px h-4 bg-current opacity-30" />
            <a href="#" className="hover:text-current transition-colors duration-300 hover:underline">Documentation</a>
            <div className="w-px h-4 bg-current opacity-30" />
            <a href="#" className="hover:text-current transition-colors duration-300 hover:underline">Support</a>
          </div>
          <p className="text-xs">&copy; 2025 {getProjectTitle()}. Built with cutting-edge technology and endless possibilities.</p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes scan {
          0% { transform: translateX(-100px); }
          100% { transform: translateX(calc(100vw + 100px)); }
        }
        
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 5px currentColor;
          }
          50% {
            box-shadow: 0 0 20px currentColor;
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
          opacity: 0;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
        
        .animate-in {
          animation-fill-mode: both;
        }
        
        .slide-in-from-top-2 {
          animation: slide-in-from-top 0.3s ease-out;
        }
        
        @keyframes slide-in-from-top {
          0% {
            opacity: 0;
            transform: translateY(-8px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: ${isDarkMode ? '#262626' : '#f5f5f5'};
        }
        
        ::-webkit-scrollbar-thumb {
          background: ${isDarkMode ? '#525252' : '#a3a3a3'};
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: ${isDarkMode ? '#737373' : '#737373'};
        }
        
        /* Responsive text sizing */
        @media (max-width: 768px) {
          .text-6xl {
            font-size: 3rem;
          }
          
          .text-8xl {
            font-size: 4rem;
          }
        }
        
        /* Performance optimizations */
        * {
          backface-visibility: hidden;
          perspective: 1000px;
        }
        
        .transform {
          transform-style: preserve-3d;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;