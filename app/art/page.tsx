import { ArtGallery } from "@/app/components/art-gallery";
import { getArtworksAction } from "@/actions/artworks-actions";

export default async function ArtPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const page = Number(searchParams.page) || 1;
  const result = await getArtworksAction({
    page: page.toString(),
    query: searchParams.search as string || "",
    type: searchParams.type as "all" | "human" | "ai" || "all",
    published: "published",
    sortOrder: searchParams.sortOrder as 'asc' | 'desc' || 'desc',
    sortBy: searchParams.sortBy as 'created' | 'title' || 'created'
  }, false);

  return (
    <div className="max-w-[95%] sm:max-w-[90%] lg:max-w-[80%] mx-auto py-32">
      <ArtGallery 
        initialArtworks={result.status === "success" ? result.data : []}
        initialTotalPages={result.status === "success" ? Math.ceil(result.total / 12) : 1}
        editMode={false}
      />
    </div>
  );
}