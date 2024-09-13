import { getArtwork } from "@/db/queries/artworks-queries";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import ArtworkDetails from "@/app/components/artwork-details";
import { RelatedArtworks } from "@/app/components/related-artworks";
import { generateColorTones } from "@/utils/color-utils";
import { createClient } from "@/utils/supabase/server";
import { Metadata } from 'next';
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

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

export async function generateMetadata({ params }: { params: { title: string } }): Promise<Metadata> {
  const artwork = await getArtwork(params.title);

  if (!artwork) {
    return {
      title: 'Artwork Not Found',
    };
  }

  return {
    title: `${artwork.title} | Help I'm fine`,
    description: artwork.description || `View "${artwork.title}" by Thomas Wainwright`,
    openGraph: {
      title: `${artwork.title} | Help I'm fine`,
      description: artwork.description || `View "${artwork.title}" by Thomas Wainwright`,
      images: [{ url: artwork.imageUrl || "/placeholder.png" }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${artwork.title} | Help I'm fine`,
      description: artwork.description || `View "${artwork.title}" by Thomas Wainwright`,
      images: [artwork.imageUrl || "/placeholder.png"],
    },
  };
}

export default async function ArtworkDetailPage({ params }: { params: { title: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const artwork = await getArtwork(params.title);

  if (!artwork) {
    notFound();
  }

  if (!artwork.published && !user) {
    redirect('/login');
  }

  const artworkColors = artwork.colours && Array.isArray(artwork.colours)
    ? artwork.colours.map((c: { hex: string }) => c.hex)
    : ['#D3D3D3', '#62757f', '#4B4B4B', '#8A9A5B'];

  const colorTones = artworkColors.map((color: string) => generateColorTones(color));

  return (
    <div className="min-h-screen" style={{ backgroundColor: `${colorTones[1][5]}` }}>
      <div className="max-w-[95%] sm:max-w-[90%] lg:max-w-[80%] mx-auto py-28">
        <Suspense fallback={<ArtworkDetailSkeleton />}>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Main Artwork Section */}
            <div className="w-full xl:w-2/3">
              <Image
                src={artwork.imageUrl || "/placeholder.png"}
                alt={artwork.accessibilityDescription || artwork.title}
                width={1000}
                height={1000}
                className="w-full h-auto object-cover rounded-lg"
                // placeholder="blur"
                // blurDataURL="/placeholder.png"
              />
            </div>
            {/* Artwork Details */}
            <div className="w-full xl:w-1/3 flex flex-col">
              <ArtworkDetails artwork={artwork}/>
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