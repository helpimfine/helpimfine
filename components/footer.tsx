"use client";

import { useColors } from "@/app/context/color-context";
import { usePathname } from "next/navigation";

export default function Footer() {
  const { colorTones } = useColors();
  const pathname = usePathname();
  
  // Hide footer on homepage
  if (pathname === '/') {
    return null;
  }
  
  return (
    <footer 
      className="w-full py-12 text-center"
      style={{ 
        backgroundColor: colorTones ? colorTones[1][5] : 'transparent'
      }}
    >
      <p 
        className="text-sm font-inter"
        style={{ 
          color: colorTones ? colorTones[1][1] : 'inherit',
          opacity: 0.4
        }}
      >
        &copy; 2022-{new Date().getFullYear()} Thomas Wainwright. All rights reserved.
      </p>
    </footer>
  );
}