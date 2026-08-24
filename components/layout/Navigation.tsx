"use client";

import { useState, useEffect } from "react";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Control Scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Ruangan", href: "#facilities" },
    { name: "Menu", href: "#menu" },
    { name: "Experience", href: "#gallery" },
    { name: "Reservasi", href: "#Reservasi" },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-500 ease-in-out top-4 px-4 md:px-8`}
    >
      <div
        className={`w-full max-w-container-max mx-auto transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] rounded-full border ${isScrolled
          ? "border-outline/30 bg-white/30 backdrop-blur-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.09)] py-2 px-5 md:px-7"
          : "border-white/10 bg-black/50 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.8)] py-2 px-5 md:px-7"
          }`}
      >
        <div className="flex justify-between items-center w-full">
          {/* Logo */}
          <div className="flex items-center gap-3 md:gap-4 group cursor-pointer">
            <div className="relative overflow-hidden rounded-full border border-primary/20">
              <img
                alt="LogoNorma"
                className="h-10 w-10 md:h-12 md:w-12 object-cover"
                src="/assets/Coffeshoplogo.jpeg"
              />
            </div>
            <span className="font-bold text-[20px] md:text-[25px] text-primary tracking-tighter leading-none group-hover:text-primary transition-colors mt-1 md:mt-0">
              <span style={{ color: '#3099ffff' }}>Coffee Shop</span>
            </span>
          </div>  
          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-6 lg:gap-10">
            <div className="flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="relative font-label-bold font-bold text-sm uppercase tracking-widest group overflow-hidden"
                >
                  <span className={`relative z-10 transition-colors duration-300 group-hover:text-primary ${isScrolled ? 'text-on-surface' : 'text-white'}`}>
                    {link.name}
                  </span>
                  <span className="absolute left-0 bottom-0 w-full h-[2px] bg-primary -translate-x-[101%] group-hover:translate-x-0 transition-transform duration-300 ease-out"></span>
                </a>
              ))}
            </div>
          </div>
          {/* Mobile Menu Toggle */}
          <button
            className={`lg:hidden focus:outline-none z-50 relative flex items-center justify-center w-10 h-10 transition-colors duration-300 ${isScrolled ? 'text-primary' : 'text-white'}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span
              className={`material-symbols-outlined text-[30px] transition-transform duration-300 absolute ${isMobileMenuOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
                }`}
            >
              menu
            </span>
            <span
              className={`material-symbols-outlined text-[30px] transition-transform duration-300 absolute ${isMobileMenuOpen ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"
                }`}
            >
              close
            </span>
          </button>
        </div>
      </div>
      <div
        className={`fixed top-24 right-2 sm:right-8 bg-background/95 backdrop-blur-xl border border-outline/20 p-5 rounded-3xl z-40 flex flex-col items-start transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] lg:hidden w-auto min-w-[120px] shadow-2xl shadow-black/10 ${isMobileMenuOpen
          ? "opacity-100 visible translate-y-0"
          : "opacity-0 invisible -translate-y-4"
          }`}
      >
        <div className="flex flex-col items-start gap-3 w-full">
          {navLinks.map((link, index) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block font-headline-md font-bold text-xl text-on-surface hover:text-primary hover:translate-x-[-8px] transition-all duration-300 w-full border-b border-white/5 pb-2 text-right"
              style={{
                transitionDelay: isMobileMenuOpen ? `${index * 50}ms` : "0ms",
                opacity: isMobileMenuOpen ? 1 : 0,
                transform: isMobileMenuOpen ? "translateX(0)" : "translateX(20px)",
              }}
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
