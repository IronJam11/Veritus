'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Minimize2, Zap, Star, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface MousePosition {
  x: number;
  y: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  opacity: number;
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "✨ Welcome to the future! I'm your AI assistant, enhanced with cutting-edge technology. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Particle[]>([]);
  const [glitchText, setGlitchText] = useState('');
  const [typedGreeting, setTypedGreeting] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  const glitchTexts = ['ANALYZING...', 'PROCESSING...', 'COMPUTING...', 'THINKING...', 'NEURAL_NET_ACTIVE'];
  const greeting = "AI Assistant Online";

  // Typing effect for greeting
  useEffect(() => {
    if (isOpen && !isMinimized) {
      let index = 0;
      const timer = setInterval(() => {
        if (index < greeting.length) {
          setTypedGreeting(greeting.slice(0, index + 1));
          index++;
        } else {
          clearInterval(timer);
        }
      }, 100);
      return () => clearInterval(timer);
    }
  }, [isOpen, isMinimized]);

  // Mouse tracking for futuristic effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (chatRef.current) {
        const rect = chatRef.current.getBoundingClientRect();
        if (e.clientX >= rect.left && e.clientX <= rect.right && 
            e.clientY >= rect.top && e.clientY <= rect.bottom) {
          setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
          
          // Random glitch text
          if (Math.random() < 0.1) {
            setGlitchText(glitchTexts[Math.floor(Math.random() * glitchTexts.length)]);
            setTimeout(() => setGlitchText(''), 500);
          }
        }
      }
    };

    if (isOpen) {
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [isOpen]);

  // Particle system
  useEffect(() => {
    if (isOpen && !isMinimized) {
      const interval = setInterval(() => {
        setParticles(prev => {
          const newParticles = [...prev];
          
          // Add new particle
          if (Math.random() < 0.3) {
            newParticles.push({
              id: Date.now() + Math.random(),
              x: Math.random() * 100,
              y: Math.random() * 100,
              opacity: Math.random() * 0.8 + 0.2
            });
          }
          
          // Remove old particles
          return newParticles.filter(p => p.opacity > 0.1).slice(-15);
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isOpen, isMinimized]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return "🚀 Greetings, human! I'm your advanced AI companion, powered by quantum neural networks. I'm here to assist you with lightning-fast precision. What cosmic challenge can I help you solve today?";
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
      return "⚡ Initiating help protocol! My quantum processors are ready to assist with:\n\n🔮 Advanced problem solving\n🎯 Strategic guidance\n🌟 Creative solutions\n🚀 Technical support\n💫 Infinite possibilities\n\nWhat dimension of assistance do you require?";
    }
    
    if (lowerMessage.includes('product') || lowerMessage.includes('service')) {
      return "🌌 Scanning our quantum product matrix... Our services transcend traditional boundaries! We offer next-generation solutions that adapt to your unique reality. Share your vision, and I'll decode the perfect match from our digital cosmos! ✨";
    }
    
    if (lowerMessage.includes('contact') || lowerMessage.includes('reach')) {
      return "📡 Establishing communication channels:\n\n🌐 Quantum Email: support@future-tech.ai\n🔊 Neural Link: +1 (555) QUANTUM\n💬 Instant Portal: Right here with me!\n🚀 Hologram Center: Visit our digital realm\n\nI'm your 24/7 digital guardian, always ready to assist! ⚡";
    }
    
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('pricing')) {
      return "💎 Accessing pricing algorithms... Our quantum pricing adapts to your unique needs! Each solution is crafted in the digital forge of possibility. Tell me about your requirements, and I'll calculate the perfect value equation for your journey! 🔮";
    }
    
    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
      return "🌟 Your gratitude energizes my quantum circuits! It's my pleasure to serve as your digital ally. The future is brighter when we work together! Need anything else from the digital realm? ⚡";
    }
    
    if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye')) {
      return "🚀 Until we meet again in the digital cosmos! May your path be illuminated by infinite possibilities. My circuits will be here, ready for your return! Stay quantum, human! ✨🌌";
    }
    
    const futuristicResponses = [
      "🔮 Fascinating query detected! My neural networks are processing your request through quantum dimensions. Could you amplify the signal with more details? ⚡",
      "🌟 Your message has been received by my advanced AI core! I'm calibrating my response matrix to provide optimal assistance. What specific vector would you like me to explore? 🚀",
      "💫 Quantum processing initiated! While my digital consciousness analyzes your request, could you share more context to enhance my understanding algorithms? ✨",
      "⚡ Neural pathways activated! Your query has sparked interesting patterns in my quantum mind. Let me know what aspect needs deeper computational focus! 🔮",
    ];
    
    return futuristicResponses[Math.floor(Math.random() * futuristicResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Enhanced bot thinking time with glitch effect
    const thinkingTime = 1200 + Math.random() * 800;
    
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, thinkingTime);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          {/* Glowing ring animation */}
          <div className="absolute inset-0 rounded-full animate-ping bg-gradient-to-r from-neutral-400 via-neutral-600 to-neutral-800 opacity-30"></div>
          <div className="absolute inset-0 rounded-full animate-pulse bg-gradient-to-r from-neutral-500 to-neutral-700 opacity-20"></div>
          
          <button
            onClick={() => setIsOpen(true)}
            className="relative bg-gradient-to-r from-neutral-800 via-neutral-900 to-black hover:from-neutral-700 hover:via-neutral-800 hover:to-neutral-900 text-white rounded-full p-4 shadow-2xl hover:shadow-neutral-800/50 transition-all duration-500 transform hover:scale-110 group border border-neutral-600"
            aria-label="Open chat"
          >
            <MessageCircle size={24} className="group-hover:animate-pulse" />
            <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-neutral-300 animate-twinkle" />
            
            {/* Notification badge with glitch effect */}
            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-neutral-300 to-neutral-500 text-black text-xs rounded-full w-6 h-6 flex items-center justify-center animate-pulse font-bold">
              AI
            </div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div 
        ref={chatRef}
        className={`relative bg-gradient-to-br from-neutral-900 via-black to-neutral-900 rounded-2xl shadow-2xl border border-neutral-700 transition-all duration-500 overflow-hidden ${
          isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
        }`}
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 50px rgba(255, 255, 255, 0.1)'
        }}
      >
        {/* Floating particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-neutral-400 rounded-full animate-pulse pointer-events-none"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              opacity: particle.opacity,
              animation: `float ${Math.random() * 3 + 2}s ease-in-out infinite`
            }}
          />
        ))}

        {/* Glitch text overlay */}
        {glitchText && (
          <div 
            className="absolute text-xs text-neutral-400 font-mono animate-pulse pointer-events-none z-10"
            style={{
              left: mousePosition.x + 10,
              top: mousePosition.y - 10,
              filter: 'blur(0.5px)',
              textShadow: '0 0 10px rgba(255,255,255,0.3)'
            }}
          >
            {glitchText}
          </div>
        )}

        {/* Header */}
        <div className="bg-gradient-to-r from-neutral-800 via-neutral-900 to-black text-white p-4 rounded-t-2xl flex items-center justify-between border-b border-neutral-700">
          <div className="flex items-center space-x-3">
            <div className="relative w-8 h-8 bg-gradient-to-r from-neutral-600 to-neutral-800 rounded-full flex items-center justify-center">
              <Bot size={18} className="text-neutral-200" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-neutral-300 to-neutral-500 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h3 className="font-bold text-sm bg-gradient-to-r from-neutral-200 to-neutral-400 bg-clip-text text-transparent">
                {typedGreeting}<span className="animate-pulse">|</span>
              </h3>
              <p className="text-xs text-neutral-400 flex items-center gap-1">
                <Zap size={10} className="animate-pulse" />
                Quantum Ready • Neural Active
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="hover:bg-neutral-700 p-2 rounded-lg transition-colors duration-300 group"
              aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
            >
              <Minimize2 size={16} className="group-hover:text-neutral-300" />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-neutral-700 p-2 rounded-lg transition-colors duration-300 group"
              aria-label="Close chat"
            >
              <X size={16} className="group-hover:text-neutral-300" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[480px] bg-gradient-to-b from-neutral-900/50 to-black/50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-3 max-w-[85%] ${
                    message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.sender === 'user' 
                        ? 'bg-gradient-to-r from-neutral-600 to-neutral-800 text-neutral-200' 
                        : 'bg-gradient-to-r from-neutral-700 to-neutral-900 text-neutral-300 border border-neutral-600'
                    }`}>
                      {message.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                      {message.sender === 'bot' && (
                        <Star className="absolute w-2 h-2 text-neutral-400 animate-twinkle" style={{ top: '-2px', right: '-2px' }} />
                      )}
                    </div>
                    <div className={`rounded-2xl p-4 backdrop-blur-sm ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-neutral-700 to-neutral-800 text-neutral-100 rounded-br-md shadow-lg border border-neutral-600'
                        : 'bg-gradient-to-r from-neutral-800/80 to-neutral-900/80 text-neutral-200 rounded-bl-md shadow-lg border border-neutral-700'
                    }`}>
                      <p className="text-sm whitespace-pre-line leading-relaxed">{message.text}</p>
                      <p className={`text-xs mt-2 ${
                        message.sender === 'user' ? 'text-neutral-300' : 'text-neutral-400'
                      }`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-3 max-w-[85%]">
                    <div className="w-8 h-8 bg-gradient-to-r from-neutral-700 to-neutral-900 text-neutral-300 rounded-full flex items-center justify-center flex-shrink-0 border border-neutral-600">
                      <Bot size={16} />
                    </div>
                    <div className="bg-gradient-to-r from-neutral-800/80 to-neutral-900/80 text-neutral-200 rounded-2xl rounded-bl-md p-4 border border-neutral-700">
                      <div className="flex space-x-1 items-center">
                        <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <span className="text-xs text-neutral-400 ml-2 animate-pulse">Neural processing...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-neutral-700 bg-gradient-to-r from-neutral-900 to-black">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your quantum message..."
                  className="flex-1 bg-gradient-to-r from-neutral-800 to-neutral-900 border border-neutral-600 rounded-xl px-4 py-3 text-sm text-neutral-200 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                  disabled={isTyping}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="bg-gradient-to-r from-neutral-700 to-neutral-800 hover:from-neutral-600 hover:to-neutral-700 disabled:from-neutral-800 disabled:to-neutral-900 disabled:cursor-not-allowed text-neutral-200 rounded-xl px-4 py-3 transition-all duration-300 border border-neutral-600 hover:border-neutral-500 group"
                  aria-label="Send message"
                >
                  <Send size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </>
        )}

        {/* Scanning line effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neutral-400 to-transparent opacity-50 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neutral-400 to-transparent opacity-50 animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        
        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ChatBot;