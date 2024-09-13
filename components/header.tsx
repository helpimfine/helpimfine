"use client";

import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Logo } from "./logo";
import { createClient } from "@/utils/supabase/client";
import { User } from '@supabase/supabase-js'; // Add this import

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchUser();

    return () => {
      // Cleanup function if needed
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-card/5 backdrop-blur-xl fixed top-0 left-0 right-0 z-50">
      <div className="w-full max-w-[95%] sm:max-w-[90%] lg:max-w-[80%] mx-auto py-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/">
            <Logo className="h-7 w-auto" />
          </Link>
        </div>
        <nav className="hidden md:flex space-x-6 text-2xl font-bebas-neue">
          <Link href="/art" className="hover:underline">Art</Link>
          <Link href="/audio" className="hover:underline">Audio</Link>
          <Link href="/about" className="hover:underline">About</Link>
        </nav>
        <div className="flex items-center space-x-4">
          {user && (
            <Link href="/art/edit" className="text-sm hover:underline">
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
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <nav className="md:hidden bg-transparent text-primary p-4 text-4xl font-bebas-neue">
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