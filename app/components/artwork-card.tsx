import { artworksTable, SelectArt, InsertArt } from "@/db/schema/artworks-schema";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import Image from 'next/image';
import { generateColorTones } from "@/utils/color-utils"; 
import { MagicCard } from "@/components/ui/magic-card";
import { Badge } from "@/components/ui/badge";
import { useCardSize } from "@/app/hooks/useCardSize";
import { EditArtwork } from "@/app/components/edit-artwork";
import { useRouter } from "next/navigation";
import { updateArtworkAction } from "@/actions/artworks-actions";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { useState, useCallback } from 'react';
import { Skeleton } from "@/components/ui/skeleton";

interface Colour {
  hex: string;
}

interface ArtworkCardProps {
  artwork: SelectArt;
  editMode: boolean;
  onEdit?: (artwork: SelectArt) => void;
  cardSize: { width: number; height: number };
}

export function ArtworkCard({ artwork, editMode, onEdit, cardSize }: ArtworkCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const { getTypographySize } = useCardSize(cardSize);

  const defaultColor = "#262626";
  const colours = artwork.colours as Colour[] | null;
  const gradientColor = colours && colours.length > 1 
    ? colours[1]?.hex || defaultColor
    : defaultColor;

  const handleUpdateArtwork = async (updatedArtwork: Partial<InsertArt>) => {
    if (!artwork.id) {
      console.error("Artwork ID is missing");
      return;
    }
    const result = await updateArtworkAction(artwork.id, updatedArtwork);
    if (result.status === "success") {
      setIsDialogOpen(false);
      router.refresh(); // Refresh the page
    } else {
      console.error("Failed to update artwork:", result.message);
    }
  };

  const handleCloseDialog = useCallback(() => {
    setIsDialogOpen(false);
  }, []);

  const handleDeleteArtwork = useCallback(() => {
    setIsDialogOpen(false);
    router.push('/art/edit');
    router.refresh(); // Refresh the page after redirecting
  }, [router]);

  return (
    <MagicCard 
      className="overflow-hidden group relative cursor-pointer border-none bg-transparent"
      gradientColor={gradientColor}
      gradientSize={300}
      gradientTransparency={40}
      style={{ width: `${cardSize.width}px`, height: `${cardSize.height}px` }}
    >
      <div className="aspect-square relative">
        <Skeleton className="absolute inset-0 rounded-lg"
        style={{ background: `${generateColorTones(gradientColor)[6]}` }}/>
        <Image
          src={artwork.imageUrl || "/placeholder.png"}
          alt={artwork.accessibilityDescription || artwork.title}
        fill
        className="rounded-lg"
        style={{ objectFit: 'cover' }}
        priority
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
        {editMode && (
          <Badge 
            className="absolute top-4 left-4 z-10" 
            variant={artwork.published ? "default" : "secondary"}
          >
            {artwork.published ? "Published" : "Draft"}
          </Badge>
        )}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
          style={{
            background: `linear-gradient(to top, ${generateColorTones(gradientColor)[6]}99, ${generateColorTones(gradientColor)[6]}4D, transparent)`
          }}
        />
      </div>

      <CardContent className="absolute bottom-0 border-none left-0 right-0 p-4 hover:border-none flex flex-col items-start">
        {artwork.type && (
          <Badge 
            className="uppercase mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
            variant="outline" 
            style={{ 
              color: generateColorTones(gradientColor || "#262626")[2],
              borderColor: generateColorTones(gradientColor || "#262626")[2],
              fontSize: `${getTypographySize(12)}px`,
            }}
          >
            {artwork.type}
          </Badge>
        )}
  
        <h2
          className="opacity-0 group-hover:opacity-100 transition-opacity pb-0 duration-300 font-semibold line-clamp-4"
          style={{ 
            color: generateColorTones(gradientColor || "#262626")[2],
            fontSize: `${getTypographySize(48)}px`,
            lineHeight: `${getTypographySize(48)}px`,
          }}
        >
          {artwork.title ?? 'Untitled'}
        </h2>
      </CardContent>
      {editMode && (
        <CardFooter className="absolute top-0 right-0 p-2" onClick={(e) => e.preventDefault()}>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="p-0 border-none bg-transparent">
              <EditArtwork
                artwork={artwork}
                onSubmit={handleUpdateArtwork}
                onClose={handleCloseDialog}
                onDelete={handleDeleteArtwork}
              />
            </DialogContent>
          </Dialog>
        </CardFooter>
      )}
    </MagicCard>
  );
}