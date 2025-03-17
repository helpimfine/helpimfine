"use client";

import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Logo } from "./logo";
import { createClient } from "@/utils/supabase/client";
import { User } from '@supabase/supabase-js';
import { usePathname } from 'next/navigation';
import { useColors } from "@/app/context/color-context";

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
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
              <Logo className="h-7 w-auto" />
            </Link>
          </div>
          {!isHomePage && (
            <>
              <nav className="hidden md:flex space-x-6 text-2xl font-bebas-neue">
                <Link href="/art" className="hover:underline">Art</Link>
                <Link href="/audio" className="hover:underline">Audio</Link>
                <Link href="/about" className="hover:underline">About</Link>
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
    transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1), opacity 300ms cubic-bezier(0.4, 0, 0.2, 1), background-color 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    backgroundImage: 'none'
  };

  return (
    <header 
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md ${
        isVisible || isHovered ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}
      style={headerStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-full max-w-[95%] sm:max-w-[90%] lg:max-w-[80%] mx-auto py-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/">
            <Logo className="h-7 w-auto" style={{ color: colorTones?.[0][3] }} />
          </Link>
        </div>
        {!isHomePage && (
          <>
            <nav className="hidden md:flex space-x-6 text-2xl font-bebas-neue" style={{ color: colorTones?.[1][1] }}>
              <Link href="/art" className="hover:underline">Art</Link>
              <Link href="/audio" className="hover:underline">Audio</Link>
              <Link href="/about" className="hover:underline">About</Link>
            </nav>
            <div className="flex items-center space-x-4">
              {user && (
                <Link href="/art/edit" className="text-sm hover:underline" style={{ color: colorTones?.[1][1] }}>
                  {user.email || 'User'}
                </Link>
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
                  {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
      {!isHomePage && isMenuOpen && (
        <nav className="md:hidden bg-transparent p-4 text-4xl font-bebas-neue" style={{ color: colorTones?.[1][1] }}>
          <ul className="space-y-2">
            <li><Link href="/art" className="block hover:underline" onClick={toggleMenu}>Art</Link></li>
            <li><Link href="/audio" className="block hover:underline" onClick={toggleMenu}>Audio</Link></li>
            <li><Link href="/about" className="block hover:underline" onClick={toggleMenu}>About</Link></li>
            <li><p className="text-xl py-8 opacity-70 font-inter">&copy; 2022-{new Date().getFullYear()} Thomas Wainwright. All rights reserved.</p></li>
          </ul>
        </nav>
      )}
    </header>
  );
}