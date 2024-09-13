"use client";

import { useState, useEffect } from "react";
import { SelectArt } from "@/db/schema/artworks-schema";
import { getRelatedArtworksAction } from "@/actions/artworks-actions";
import { ArtworkGrid } from "@/app/components/artwork-grid";
import { ArtworkGridSkeleton } from "@/app/components/artwork-skeleton";

interface RelatedArtworksProps {
  currentArtworkId: string;
  artworkType: "human" | "ai";
  statusColor: string;
}

export function RelatedArtworks({ 
  currentArtworkId, 
  artworkType, 
  statusColor 
}: RelatedArtworksProps) {
  const [relatedArtworks, setRelatedArtworks] = useState<SelectArt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRelatedArtworks = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await getRelatedArtworksAction(currentArtworkId, artworkType);
        setRelatedArtworks(result);
      } catch (error) {
        console.error("Error fetching related artworks:", error);
        setError(error instanceof Error ? error.message : "An unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelatedArtworks();
  }, [currentArtworkId, artworkType]);

  if (isLoading) {
    return <ArtworkGridSkeleton />;
  }

  if (error) {
    return (
      <div style={{ color: statusColor }}>
        <p>Error: {error}</p>
      </div>
    );
  }
  const headingText = relatedArtworks.length === 0 ? "No Related Artworks Found" : "Related Artwork";

  return (
    <>
    <h2 className="text-2xl font-bold mb-4" style={{ color: statusColor }}>{headingText}</h2>
    {relatedArtworks.length > 0 && (
      <ArtworkGrid 
        artworks={relatedArtworks}
        editMode={false}
      />
    )}
    </>
  );
}