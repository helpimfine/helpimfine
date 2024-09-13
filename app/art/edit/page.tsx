import { ArtGallery } from "@/app/components/art-gallery";
import { getArtworksAction } from "@/actions/artworks-actions";

export default async function ArtEditPage() {
  const pageSize = 50;
  const result = await getArtworksAction({ pageSize: pageSize.toString() }, false);
  const artworks = result.status === "success" ? result.data : [];
  const initialTotalPages = Math.ceil(artworks.length / pageSize);

  return (
    <div className="max-w-[95%] sm:max-w-[90%] lg:max-w-[80%] mx-auto py-24">
      <ArtGallery 
        editMode={true} 
        initialArtworks={artworks} 
        initialTotalPages={initialTotalPages}
      />
    </div>
  );
}