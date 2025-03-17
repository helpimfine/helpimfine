import { getArtworksAction } from "@/actions/artworks-actions";
import { SelectArt } from "@/db/schema/artworks-schema";
import { ArtPageContent } from "@/app/components/art-page-content";

interface PaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  status: 'success' | 'error';
}

export default async function ArtPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { search, type, sortOrder, sortBy, page } = await searchParams;
  const searchTerm = search as string || "";
  const artworkType = type as "all" | "human" | "ai" || "all";
  const order = sortOrder as 'asc' | 'desc' || 'desc';
  const sort = sortBy as 'created' | 'title' || 'created';
  const pageNumber = Number(page) || 1;

  const result = await getArtworksAction({
    page: pageNumber.toString(),
    query: searchTerm,
    type: artworkType,
    published: "published",
    sortOrder: order,
    sortBy: sort
  }, false) as PaginationResult<SelectArt>;

  return (
    <ArtPageContent 
      initialArtworks={result.status === "success" ? result.data : []}
      initialTotalPages={result.status === "success" ? Math.ceil(result.total / 12) : 1}
    />
  );
}