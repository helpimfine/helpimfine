"use client";

import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { AnimatedLogo } from "./animated-logo";
import { createClient } from "@/utils/supabase/client";
import { User } from '@supabase/supabase-js';
import { usePathname } from 'next/navigation';
import { useColors } from "@/app/context/color-context";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [triggerShock, setTriggerShock] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { colorTones } = useColors();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle scroll behavior
  useEffect(() => {
    if (!mounted) return;

    let lastScrollY = window.scrollY;
    let ticking = false;
    let scrollTimeout: NodeJS.Timeout;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const headerHeight = headerRef.current?.offsetHeight || 0;
          
          setIsScrolled(currentScrollY > 0);
          
          if (currentScrollY < lastScrollY || currentScrollY < headerHeight) {
            setIsVisible(true);
          } else {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
              setIsVisible(false);
            }, 100);
          }
          
          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [mounted]);

  // Fetch user data
  useEffect(() => {
    if (!mounted) return;
    
    const fetchUser = async () => {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchUser();
  }, [mounted]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleShock = () => {
    setTriggerShock(true);
  };

  const handleShockComplete = () => {
    setTriggerShock(false);
  };

  // Check if we're on the homepage or about page
  const isHomePage = pathname === '/';
  const shouldBeTransparent = isHomePage;

  // Initial render without client-side styles
  if (!mounted) {
    return (
      <header 
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50 translate-y-0 opacity-100 backdrop-blur-md bg-transparent transition-all duration-300 ease-in-out"
      >
        <div className="w-full max-w-[95%] sm:max-w-[90%] lg:max-w-[80%] mx-auto py-6 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/">
              <div style={{ cursor: 'pointer' }}>
                <AnimatedLogo className="h-7 w-auto" />
              </div>
            </Link>
          </div>
          {!isHomePage && (
            <>
              <nav className="hidden md:flex space-x-6 text-2xl font-bebas-neue">
                <Link 
                  href="/art" 
                  style={{ 
                    color: pathname === '/art' || pathname.startsWith('/art/') 
                      ? colorTones?.[0][0] 
                      : undefined
                  }}
                >Art</Link>
                <Link 
                  href="/audio" 
                  style={{ 
                    color: pathname === '/audio' || pathname.startsWith('/audio/') 
                      ? colorTones?.[0][0] 
                      : undefined
                  }}
                >Audio</Link>
                <Link href="/about">About</Link>
              </nav>
              <div className="flex items-center space-x-4">
                <div className="md:hidden">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Toggle menu"
                    className="hover:outline-none hover:bg-card/10"
                  >
                    <Menu className="h-6 w-6" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </header>
    );
  }

  const headerStyle = {
    backgroundColor: shouldBeTransparent 
      ? (isScrolled ? `${colorTones?.[1][5]}80` : 'transparent')
      : `${colorTones?.[1][5]}80`,
    backgroundImage: 'none'
  };

  return (
    <motion.header 
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md"
      style={headerStyle}
      initial={{ opacity: 0, y: -50 }}
      animate={{ 
        opacity: 1, 
        y: isVisible || isHovered ? 0 : -100,
        scaleY: isVisible || isHovered ? 1 : 0.9,
        filter: isScrolled ? "saturate(1.1)" : "saturate(1)"
      }}
      transition={{ 
        type: "spring",
        stiffness: 150,
        damping: 15,
        mass: 1
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-full max-w-[95%] sm:max-w-[90%] lg:max-w-[80%] mx-auto py-6 flex items-center justify-between">
        <motion.div 
          className="flex items-center"
          initial={{ x: -10 }}
          animate={{ x: 0 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 12
          }}
        >
          <Link href="/">
            <div onClick={() => {
              handleShock();
            }} style={{ cursor: 'pointer' }}>
              <AnimatedLogo 
                className="h-7 w-auto" 
                style={{ color: colorTones?.[0][3] }} 
                shock={triggerShock}
                onShockComplete={handleShockComplete}
              />
            </div>
          </Link>
        </motion.div>
        {!isHomePage && (
          <>
            <nav className="hidden md:flex space-x-6 text-2xl font-bebas-neue" style={{ color: colorTones?.[1][1] }}>
              <motion.div 
                whileHover={{ 
                  scale: 1.15,
                  textShadow: "0 0 8px rgba(255,255,255,0.3)",
                  y: -2
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 10
                }}
              >
                <Link 
                  href="/art" 
                  style={{ 
                    color: pathname === '/art' || pathname.startsWith('/art/') 
                      ? colorTones?.[0][0] 
                      : undefined,
                    textShadow: pathname === '/art' || pathname.startsWith('/art/')
                      ? "0 0 8px rgba(255,255,255,0.3)"
                      : undefined
                  }}
                >
                  Art
                </Link>
              </motion.div>
              <motion.div 
                whileHover={{ 
                  scale: 1.15,
                  textShadow: "0 0 8px rgba(255,255,255,0.3)",
                  y: -2
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 10
                }}
              >
                <Link 
                  href="/audio" 
                  style={{ 
                    color: pathname === '/audio' || pathname.startsWith('/audio/') 
                      ? colorTones?.[0][0] 
                      : undefined,
                    textShadow: pathname === '/audio' || pathname.startsWith('/audio/')
                      ? "0 0 8px rgba(255,255,255,0.3)"
                      : undefined
                  }}
                >
                  Audio
                </Link>
              </motion.div>
              <motion.div 
                whileHover={{ 
                  scale: 1.15,
                  textShadow: "0 0 8px rgba(255,255,255,0.3)",
                  y: -2
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 10
                }}
              >
                <Link href="/about">About</Link>
              </motion.div>
            </nav>
            <div className="flex items-center space-x-4">
              {user && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link href="/art/edit" className="text-sm hover:underline" style={{ color: colorTones?.[1][1] }}>
                    {user.email || 'User'}
                  </Link>
                </motion.div>
              )}
              <div className="md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMenu}
                  aria-label="Toggle menu"
                  className="hover:outline-none hover:bg-card/10"
                  style={{ color: colorTones?.[0][3] }}
                >
                  <motion.div
                    initial={{ scale: 1 }}
                    animate={{ 
                      rotate: isMenuOpen ? 360 : 0,
                      scale: isMenuOpen ? 1.1 : 1
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      duration: 0.5
                    }}
                  >
                    {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                  </motion.div>
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
      <AnimatePresence>
        {!isHomePage && isMenuOpen && (
          <motion.nav 
            className="md:hidden bg-transparent p-4 text-4xl font-bebas-neue" 
            style={{ color: colorTones?.[1][1] }}
            initial={{ opacity: 0, height: 0, clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ 
              opacity: 1, 
              height: 'auto', 
              clipPath: "inset(0% 0% 0% 0%)"
            }}
            exit={{ 
              opacity: 0, 
              height: 0, 
              clipPath: "inset(0% 0% 100% 0%)",
              transition: { duration: 0.3 }
            }}
            transition={{ 
              type: "spring",
              stiffness: 250,
              damping: 25,
              mass: 1
            }}
          >
            <ul className="space-y-2">
              <motion.li 
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -40, opacity: 0 }}
                transition={{ 
                  delay: 0.1,
                  type: "spring",
                  stiffness: 200,
                  damping: 10
                }}
                whileHover={{ 
                  scale: 1.05, 
                  x: 5,
                  textShadow: "0 0 8px rgba(255,255,255,0.3)"
                }}
              >
                <Link 
                  href="/art" 
                  className="block" 
                  onClick={toggleMenu}
                  style={{ 
                    color: pathname === '/art' || pathname.startsWith('/art/') 
                      ? colorTones?.[0][0] 
                      : undefined,
                    textShadow: pathname === '/art' || pathname.startsWith('/art/')
                      ? "0 0 8px rgba(255,255,255,0.3)"
                      : undefined
                  }}
                >
                  Art
                </Link>
              </motion.li>
              <motion.li 
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -40, opacity: 0 }}
                transition={{ 
                  delay: 0.2,
                  type: "spring",
                  stiffness: 200,
                  damping: 10
                }}
                whileHover={{ 
                  scale: 1.05, 
                  x: 5,
                  textShadow: "0 0 8px rgba(255,255,255,0.3)"
                }}
              >
                <Link 
                  href="/audio" 
                  className="block" 
                  onClick={toggleMenu}
                  style={{ 
                    color: pathname === '/audio' || pathname.startsWith('/audio/') 
                      ? colorTones?.[0][0] 
                      : undefined,
                    textShadow: pathname === '/audio' || pathname.startsWith('/audio/')
                      ? "0 0 8px rgba(255,255,255,0.3)"
                      : undefined
                  }}
                >
                  Audio
                </Link>
              </motion.li>
              <motion.li 
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -40, opacity: 0 }}
                transition={{ 
                  delay: 0.3,
                  type: "spring",
                  stiffness: 200,
                  damping: 10
                }}
                whileHover={{ 
                  scale: 1.05, 
                  x: 5,
                  textShadow: "0 0 8px rgba(255,255,255,0.3)"
                }}
              >
                <Link href="/about" className="block" onClick={toggleMenu}>About</Link>
              </motion.li>
              <motion.li 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 0.7, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <p className="text-xl py-8 opacity-70 font-inter">&copy; 2022-{new Date().getFullYear()} Thomas Wainwright. All rights reserved.</p>
              </motion.li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}