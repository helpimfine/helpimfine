"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { SelectArt } from "@/db/schema/artworks-schema";
import { getArtworksAction } from "@/actions/artworks-actions";
import { ArtworkGrid } from "@/app/components/artwork-grid";
import { Filters } from "@/app/components/filters";
import { ArtworkGridSkeleton } from "@/app/components/artwork-skeleton";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useEffect, useState, useCallback } from "react";

interface ArtGalleryProps {
  initialArtworks: SelectArt[];
  initialTotalPages: number;
  editMode: boolean;
}

export function ArtGallery({ initialArtworks, initialTotalPages, editMode }: ArtGalleryProps) {
  const [artworks, setArtworks] = useState(initialArtworks);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const fetchArtworks = useCallback(async () => {
    setIsLoading(true);
    const result = await getArtworksAction({
      page: searchParams.get('page') || '1',
      pageSize: "12",
      query: searchParams.get('search') || '',
      type: searchParams.get('type') as "all" | "human" | "ai" || "all",
      published: editMode ? (searchParams.get('published') as "all" | "published" | "unpublished") || "all" : "published",
      sortOrder: searchParams.get('sortOrder') as 'asc' | 'desc' || 'desc',
      sortBy: searchParams.get('sortBy') as 'created' | 'title' || 'created'
    }, editMode);
    if (result.status === "success") {
      setArtworks(result.data);
      setTotalPages(Math.ceil(result.total / 12)); // Calculate total pages
    }
    setIsLoading(false);
  }, [searchParams, editMode]);

  useEffect(() => {
    fetchArtworks();
  }, [fetchArtworks]);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    router.push(`?${params.toString()}`);
  };

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('search', term);
    } else {
      params.delete('search');
    }
    params.set('page', '1'); // Reset to first page on new search
    router.push(`?${params.toString()}`);
  };

  const currentPage = Number(searchParams.get('page') || '1');

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(currentPage - halfVisible, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    if (startPage > 1) {
      items.push(
        <PaginationItem key="first">
          <PaginationLink onClick={() => handlePageChange(1)}>1</PaginationLink>
        </PaginationItem>
      );
      if (startPage > 2) {
        items.push(<PaginationEllipsis key="ellipsis-start" />);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink isActive={i === currentPage} onClick={() => handlePageChange(i)}>
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(<PaginationEllipsis key="ellipsis-end" />);
      }
      items.push(
        <PaginationItem key="last">
          <PaginationLink onClick={() => handlePageChange(totalPages)}>{totalPages}</PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div className="mx-auto">
      <Filters editMode={editMode} onSearch={handleSearch} />
      
      {isLoading ? (
        <ArtworkGridSkeleton />
      ) : (
        <ArtworkGrid 
          artworks={artworks}
          editMode={editMode}
        />
      )}

      {totalPages > 1 && (
        <div className="py-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? 'opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              {renderPaginationItems()}
              <PaginationItem>
                <PaginationNext 
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? 'opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}