import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'Architecture', href: '#architecture' },
    { name: 'Simulator', href: '#simulator' },
    { name: 'Frameworks', href: '#frameworks' },
    { name: 'Lifecycle', href: '#lifecycle' },
    { name: 'Resilience', href: '#resilience' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'py-4 bg-black/60 backdrop-blur-md border-b border-white/5' : 'py-6 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-10 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2">
          <span className="text-xl font-black tracking-tighter text-white">
            <span className="text-cyan">pycall</span>-node
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          <div className="flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-[12px] font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest"
              >
                {link.name}
              </a>
            ))}
          </div>
          
          <a
            href="https://www.npmjs.com/package/pycall-node"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 rounded-lg border border-cyan/30 text-cyan text-[12px] font-bold hover:bg-cyan/5 transition-all uppercase tracking-widest"
          >
            npm install
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
