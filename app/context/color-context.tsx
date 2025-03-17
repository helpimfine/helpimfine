"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { generateColorTones } from '@/utils/color-utils';

interface ColorContextType {
  colorTones: string[][] | null;
  setColorTones: (colors: string[][] | null) => void;
  lastViewedArtworkUrl: string | null;
  setLastViewedArtworkUrl: (url: string | null) => void;
}

const ColorContext = createContext<ColorContextType | undefined>(undefined);

export function ColorProvider({ children }: { children: React.ReactNode }) {
  const [colorTones, setColorTones] = useState<string[][] | null>(null);
  const [lastViewedArtworkUrl, setLastViewedArtworkUrl] = useState<string | null>(null);

  useEffect(() => {
    // Load saved colors from localStorage on mount
    const savedColors = localStorage.getItem('artworkColors');
    const savedUrl = localStorage.getItem('lastViewedArtworkUrl');
    
    if (savedColors) {
      setColorTones(JSON.parse(savedColors));
    }
    if (savedUrl) {
      setLastViewedArtworkUrl(savedUrl);
    }
  }, []);

  useEffect(() => {
    // Save colors to localStorage whenever they change
    if (colorTones) {
      localStorage.setItem('artworkColors', JSON.stringify(colorTones));
    }
  }, [colorTones]);

  useEffect(() => {
    // Save URL to localStorage whenever it changes
    if (lastViewedArtworkUrl) {
      localStorage.setItem('lastViewedArtworkUrl', lastViewedArtworkUrl);
    }
  }, [lastViewedArtworkUrl]);

  return (
    <ColorContext.Provider value={{ colorTones, setColorTones, lastViewedArtworkUrl, setLastViewedArtworkUrl }}>
      {children}
    </ColorContext.Provider>
  );
}

export function useColors() {
  const context = useContext(ColorContext);
  if (context === undefined) {
    throw new Error('useColors must be used within a ColorProvider');
  }
  return context;
} 