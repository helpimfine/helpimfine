"use client";

import { useEffect } from "react";
import { useColors } from "@/app/context/color-context";

export function SaveColorsToStorage({ colorTones, artworkUrl }: { colorTones: string[][], artworkUrl: string | null }) {
  const { setColorTones, setLastViewedArtworkUrl } = useColors();

  useEffect(() => {
    // Update the context with the new colors and URL
    setColorTones(colorTones);
    if (artworkUrl) {
      setLastViewedArtworkUrl(artworkUrl);
    }
  }, [colorTones, artworkUrl, setColorTones, setLastViewedArtworkUrl]);

  // This component doesn't render anything
  return null;
} 