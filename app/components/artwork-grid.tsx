import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { SelectArt } from "@/db/schema/artworks-schema";
import { ArtworkCard } from "./artwork-card";

interface ArtworkGridProps {
  artworks: SelectArt[];
  editMode: boolean;
  onEdit?: (artwork: SelectArt) => void;
}

export function ArtworkGrid({ 
  artworks, 
  editMode, 
  onEdit
}: ArtworkGridProps) {
  const [cardSize, setCardSize] = useState({ width: 300, height: 300 });
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateCardSize = () => {
      if (gridRef.current) {
        const gridWidth = gridRef.current.offsetWidth;
        const columns = window.innerWidth >= 1024 ? 4 : window.innerWidth >= 768 ? 3 : window.innerWidth >= 640 ? 2 : 1;
        const gap = 16;
        const cardWidth = (gridWidth - (columns - 1) * gap) / columns;
        setCardSize({ width: cardWidth, height: cardWidth });
      }
    };

    updateCardSize();
    window.addEventListener('resize', updateCardSize);
    return () => window.removeEventListener('resize', updateCardSize);
  }, []);

  return (
    <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {artworks.map((artwork) => (
        <Link 
          href={`/art/${artwork.title.toLowerCase().replace(/ /g, '-')}`} 
          key={artwork.id}
        >
          <ArtworkCard
            artwork={artwork}
            editMode={editMode}
            onEdit={onEdit}
            cardSize={cardSize}
          />
        </Link>
      ))}
    </div>
  );
}