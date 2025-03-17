"use client";

import { ArtGallery } from "@/app/components/art-gallery";
import { SelectArt } from "@/db/schema/artworks-schema";
import { generateColorTones } from "@/utils/color-utils";
import { useColors } from "@/app/context/color-context";

interface ArtPageContentProps {
  initialArtworks: SelectArt[];
  initialTotalPages: number;
}

export function ArtPageContent({ 
  initialArtworks, 
  initialTotalPages 
}: ArtPageContentProps) {
  const { colorTones } = useColors();
  
  // Default colors if no artwork colors are set
  const defaultColors = ['#D3D3D3', '#62757f', '#4B4B4B', '#8A9A5B'];
  const defaultColorTones = defaultColors.map(color => generateColorTones(color));
  
  const backgroundColor = colorTones ? `${colorTones[1][5]}` : `${defaultColorTones[1][5]}`;

  return (
    <div 
      className="min-h-screen"
      style={{ 
        backgroundColor,
        transition: 'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      <div className="max-w-[95%] sm:max-w-[90%] lg:max-w-[80%] mx-auto pt-32">
        <ArtGallery 
          initialArtworks={initialArtworks}
          initialTotalPages={initialTotalPages}
          editMode={false}
        />
      </div>
    </div>
  );
} 