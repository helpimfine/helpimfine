import { SelectArt } from "@/db/schema/artworks-schema";

export interface PaginationResult<T> {
  status: string;
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ArtworkFilters {
  search: string;
  typeFilter: "all" | "human" | "ai";
  publishedFilter: "all" | "published" | "unpublished";
}
