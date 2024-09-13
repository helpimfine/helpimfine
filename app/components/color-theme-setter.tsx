'use client';

import { useEffect } from 'react';
import { generateColorTones } from "@/utils/color-utils";

interface ColorThemeSetterProps {
  colors: string[];
}

export function ColorThemeSetter({ colors }: ColorThemeSetterProps) {
  useEffect(() => {
    const root = document.documentElement;
    const colorTones = colors.map(color => generateColorTones(color));
    
    root.style.setProperty('--primary', colors[0]);
    root.style.setProperty('--primary-foreground', colors[1]);
    root.style.setProperty('--secondary', colors[2]);
    root.style.setProperty('--secondary-foreground', colors[3]);
    root.style.setProperty('--accent', colors[0]);
    root.style.setProperty('--accent-foreground', colors[1]);
    root.style.setProperty('--background', colorTones[1][5]);
    root.style.setProperty('--foreground', colorTones[0][0]);

    return () => {
      root.style.removeProperty('--primary');
      root.style.removeProperty('--primary-foreground');
      root.style.removeProperty('--secondary');
      root.style.removeProperty('--secondary-foreground');
      root.style.removeProperty('--accent');
      root.style.removeProperty('--accent-foreground');
      root.style.removeProperty('--background');
      root.style.removeProperty('--foreground');
    };
  }, [colors]);

  return null;
}