import { useState, useEffect } from "react";

interface CardSize {
  width: number;
  height: number;
}

export function useCardSize(initialSize?: CardSize) {
  const [cardSize, setCardSize] = useState<CardSize>(initialSize || { width: 300, height: 300 });

  useEffect(() => {
    if (!initialSize) {
      const updateCardSize = () => {
        const gridWidth = window.innerWidth;
        const columns = window.innerWidth >= 1024 ? 4 : window.innerWidth >= 768 ? 3 : window.innerWidth >= 640 ? 2 : 1;
        const gap = 16; // 4 * 4px (gap-4)
        const cardWidth = (gridWidth - (columns - 1) * gap) / columns;
        setCardSize({ width: cardWidth, height: cardWidth }); // Assuming square cards
      };

      updateCardSize();
      window.addEventListener('resize', updateCardSize);
      return () => window.removeEventListener('resize', updateCardSize);
    }
  }, [initialSize]);

  const getTypographySize = (baseSize: number) => {
    const scaleFactor = cardSize.width / 300; // 300px is our base card size
    return Math.max(baseSize * scaleFactor, 10); // Ensure minimum size of 10px
  };

  return { cardSize, getTypographySize };
}