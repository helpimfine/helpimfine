'use client';

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useColors } from "@/app/context/color-context";
import { generateColorTones } from "@/utils/color-utils";
import { motion } from "framer-motion";
import { MagicCard } from "@/components/ui/magic-card";
import { Badge } from "@/components/ui/badge";

export function AudioCardSkeleton({ index = 0 }: { index?: number }) {
  const { colorTones } = useColors();
  
  // Default colors if no artwork colors are set
  const defaultColors = ['#D3D3D3', '#62757f', '#4B4B4B', '#8A9A5B'];
  const defaultColorTones = defaultColors.map(color => generateColorTones(color));
  const currentColorTones = colorTones || defaultColorTones;
  
  // Use modulo 3 to alternate between 3 different variations
  const colorVariation = index % 3;
  
  // Use moderate color depths for contrast
  const bgColorDepth = [4, 5, 6][colorVariation];
  const textColorDepth = [1, 0, 0][colorVariation];
  const borderColorDepth = [3, 4, 5][colorVariation];

  // Style for the card
  const cardStyle = {
    backgroundColor: currentColorTones[0][bgColorDepth],
    color: currentColorTones[0][textColorDepth],
    borderColor: currentColorTones[0][borderColorDepth],
    borderWidth: '1px',
    borderStyle: 'solid',
    position: 'relative' as const,
  };

  // Overlay for contrast
  const overlayStyle = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    pointerEvents: 'none' as const,
    zIndex: 1,
  };

  // Style for the badge
  const badgeStyle = {
    backgroundColor: currentColorTones[1][bgColorDepth],
    color: currentColorTones[1][textColorDepth],
    position: 'relative' as const,
    zIndex: 2,
  };

  return (
    <div className="w-full">
      <MagicCard 
        className="w-full p-6 flex flex-col md:flex-row gap-6 overflow-hidden"
        style={cardStyle}
      >
        {/* Dark overlay for better contrast */}
        <div style={overlayStyle}></div>
        
        <div className="flex flex-col md:w-1/2 flex-grow" style={{ position: 'relative', zIndex: 2 }}>
          <div className="self-start mb-2">
            <Badge style={badgeStyle}>
              <Skeleton className="h-4 w-16" style={{ background: currentColorTones[1][bgColorDepth - 1] }} />
            </Badge>
          </div>
          
          <Skeleton 
            className="h-10 w-4/5 mb-2" 
            style={{ background: currentColorTones[0][bgColorDepth - 1] }} 
          />
          
          <Skeleton 
            className="h-4 w-full mb-1" 
            style={{ background: currentColorTones[0][bgColorDepth - 1] }} 
          />
          <Skeleton 
            className="h-4 w-3/4 mb-1" 
            style={{ background: currentColorTones[0][bgColorDepth - 1] }} 
          />
          
          <div className="flex flex-wrap gap-2 mt-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton 
                key={i}
                className="h-6 w-16" 
                style={{ background: currentColorTones[0][bgColorDepth - 1] }} 
              />
            ))}
          </div>
        </div>
        
        <div 
          className="relative w-full aspect-square overflow-hidden rounded-xl"
          style={{
            position: 'relative',
            zIndex: 2
          }}
        >
          <Skeleton 
            className="w-full h-full" 
            style={{ background: currentColorTones[0][bgColorDepth - 1] }} 
          />
        </div>
      </MagicCard>
    </div>
  );
}

export function AudioGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6">
      {[...Array(3)].map((_, i) => (
        <AudioCardSkeleton key={i} index={i} />
      ))}
    </div>
  );
}

export function TagsSkeleton() {
  const { colorTones } = useColors();
  
  // Default colors if no artwork colors are set
  const defaultColors = ['#D3D3D3', '#62757f', '#4B4B4B', '#8A9A5B'];
  const defaultColorTones = defaultColors.map(color => generateColorTones(color));
  const currentColorTones = colorTones || defaultColorTones;
  
  const bgColorDepth = 6;
  const textColorDepth = 0;
  
  return (
    <div className="flex flex-wrap gap-2 mb-6 items-center">
      {[...Array(6)].map((_, i) => (
        <Skeleton 
          key={i} 
          className="h-7 w-16 rounded-full"
          style={{ background: i === 0 ? currentColorTones[0][bgColorDepth] : currentColorTones[0][bgColorDepth - 1] }}
        />
      ))}
    </div>
  );
} 