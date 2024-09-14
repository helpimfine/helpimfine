"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { SelectArt } from "@/db/schema/artworks-schema";
import { getArtworksAction } from "@/actions/artworks-actions";
import { ArtworkGrid } from "@/app/components/artwork-grid";
import { Filters } from "@/app/components/filters";
import { ArtworkGridSkeleton } from "@/app/components/artwork-skeleton";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

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

  // Add this new effect to listen for the custom event
  useEffect(() => {
    const handleArtworkUpdate = () => {
      fetchArtworks();
    };

    window.addEventListener('artworkUpdated', handleArtworkUpdate);

    return () => {
      window.removeEventListener('artworkUpdated', handleArtworkUpdate);
    };
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

    const renderPageLink = (page: number, content: React.ReactNode) => (
      <PaginationItem key={page}>
        <PaginationLink
          onClick={() => handlePageChange(page)}
          isActive={page === currentPage}
          className={cn(page !== currentPage && "cursor-pointer")}
        >
          {content}
        </PaginationLink>
      </PaginationItem>
    );

    if (startPage > 1) {
      items.push(renderPageLink(1, 1));
      if (startPage > 2) items.push(<PaginationEllipsis key="ellipsis-start" />);
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(renderPageLink(i, i));
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) items.push(<PaginationEllipsis key="ellipsis-end" />);
      items.push(renderPageLink(totalPages, totalPages));
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
                  onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                  className={cn(
                    currentPage > 1 ? "cursor-pointer" : "opacity-50 pointer-events-none"
                  )}
                />
              </PaginationItem>
              {renderPaginationItems()}
              <PaginationItem>
                <PaginationNext 
                  onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                  className={cn(
                    currentPage < totalPages ? "cursor-pointer" : "opacity-50 pointer-events-none"
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}