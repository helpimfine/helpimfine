'use client';

import React from "react";
import { AudioGridSkeleton, TagsSkeleton } from "@/components/audio-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { useColors } from "@/app/context/color-context";
import { generateColorTones } from "@/utils/color-utils";
import { motion } from "framer-motion";

export default function Loading() {
  const { colorTones } = useColors();
  
  // Default colors if no artwork colors are set
  const defaultColors = ['#D3D3D3', '#62757f', '#4B4B4B', '#8A9A5B'];
  const defaultColorTones = defaultColors.map(color => generateColorTones(color));
  const currentColorTones = colorTones || defaultColorTones;
  
  // Background color from theme
  const backgroundColor = currentColorTones ? currentColorTones[1][5] : defaultColorTones[1][5];
  const textColor = currentColorTones ? currentColorTones[1][1] : defaultColorTones[1][1];

  return (
    <div className="w-full">
      <div 
        className="w-full py-24 min-h-screen"
        style={{ 
          backgroundColor: backgroundColor,
          color: textColor
        }}
      >
        <div className="max-w-[95%] sm:max-w-[90%] lg:max-w-[80%] mx-auto">
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold mb-6 font-bebas-neue">Audio</h1>
            
            <TagsSkeleton />
          </motion.div>
          
          <AudioGridSkeleton />
        </div>
      </div>
    </div>
  );
} 