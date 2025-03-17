import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import ArtworkDetails from "@/app/components/artwork-details";
import { RelatedArtworks } from "@/app/components/related-artworks";
import { generateColorTones } from "@/utils/color-utils";
import { createClient } from "@/utils/supabase/server";
import { Metadata } from 'next';
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { SaveColorsToStorage } from "@/app/components/save-colors";
import { getArtworkBySlug } from "@/db/queries/artwork-queries";

function ArtworkDetailSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="w-full xl:w-2/3">
        <Skeleton className="w-full h-[600px] rounded-lg" />
      </div>
      <div className="w-full xl:w-1/3 space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ title: string }> }): Promise<Metadata> {
  const { title } = await params;
  const artwork = await getArtworkBySlug(title);
  
  return {
    title: artwork.title,
    description: artwork.accessibilityDescription || artwork.title,
    openGraph: {
      images: artwork.imageUrl ? [{ url: artwork.imageUrl }] : [],
    },
  };
}

export default async function Page({ params }: { params: Promise<{ title: string }> }) {
  const { title } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let artwork;
  try {
    artwork = await getArtworkBySlug(title);
  } catch (error) {
    notFound();
  }

  if (!artwork) {
    notFound();
  }

  if (!artwork.published && !user) {
    redirect("/login");
  }

  const artworkColors =
    artwork.colours && Array.isArray(artwork.colours)
      ? artwork.colours.map((c: { hex: string }) => c.hex)
      : ["#D3D3D3", "#62757f", "#4B4B4B", "#8A9A5B"];

  const colorTones = artworkColors.map((color: string) =>
    generateColorTones(color)
  );

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: `${colorTones[1][5]}` }}
    >
      <div className="max-w-[95%] sm:max-w-[90%] lg:max-w-[80%] mx-auto py-28">
        <SaveColorsToStorage colorTones={colorTones} artworkUrl={artwork.imageUrl} />
        <Suspense fallback={<ArtworkDetailSkeleton />}>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Main Artwork Section */}
            <div className="w-full xl:w-2/3">
              <div className="relative w-full aspect-square">
                <Skeleton
                  className="absolute inset-1 rounded-lg"
                  style={{ background: `${colorTones[1][6]}` }}
                />
                <Image
                  src={artwork.imageUrl || "/placeholder.png"}
                  alt={artwork.accessibilityDescription || artwork.title}
                  fill
                  className="rounded-lg"
                  style={{ objectFit: "cover" }}
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1600px) 75vw, 66vw"
                />
              </div>
            </div>
            {/* Artwork Details */}
            <div className="w-full xl:w-1/3 flex flex-col">
              <ArtworkDetails artwork={artwork} />
            </div>
          </div>
        </Suspense>
        {/* Related Artwork Section */}
        <div className="mt-8">
          <RelatedArtworks
            currentArtworkId={artwork.id}
            artworkType={artwork.type}
            statusColor={colorTones[1][3]}
          />
        </div>
      </div>
    </div>
  );
}
