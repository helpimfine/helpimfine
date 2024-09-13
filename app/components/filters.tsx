"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { SearchBar } from "@/app/components/search-bar";
import { TypeFilter } from "@/app/components/type-filter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCallback, useState } from 'react';
import debounce from 'lodash/debounce';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusIcon, ArrowUpIcon, ArrowDownIcon } from "@radix-ui/react-icons";
import { ImageUpload } from "@/app/components/image-upload";
import { Label } from "@/components/ui/label";

interface FiltersProps {
  editMode: boolean;
  onSearch: (term: string) => void;
}

export function Filters({ editMode, onSearch }: FiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const updateUrlParams = useCallback((newParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    params.set('page', '1');
    router.push(`?${params.toString()}`, { scroll: false });
  }, [searchParams, router]);

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      updateUrlParams({ search: value });
    }, 300),
    [updateUrlParams]
  );

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    debouncedSearch(value);
    onSearch(value);
  };

  const handleTypeFilterChange = (value: string) => updateUrlParams({ type: value });
  const handlePublishedFilterChange = (value: string) => updateUrlParams({ published: value });
  const handleSortByChange = (value: string) => updateUrlParams({ sortBy: value });
  const handleSortOrderChange = () => {
    const currentOrder = searchParams.get('sortOrder') || 'desc';
    updateUrlParams({ sortOrder: currentOrder === 'asc' ? 'desc' : 'asc' });
  };

  const handleUploadComplete = () => {
    setIsDialogOpen(false);
    router.refresh();
  };

  return (
    <div className="space-y-6 pb-6">
      {editMode && (
        <div className="flex justify-between items-center">
          <h2 className="text-6xl font-semibold">Dashboard</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center">
                <PlusIcon className="mr-2 h-4 w-4" /> Add New
              </Button>
            </DialogTrigger>
            
            <DialogContent className="w-full max-w-4xl bg-card/20 backdrop-blur-xl border-none">
              <DialogTitle className="text-4xl">Add New Artwork</DialogTitle>
              <DialogDescription>
                Add a new artwork to the gallery.
              </DialogDescription>
              <ImageUpload onUploadComplete={handleUploadComplete} />
            </DialogContent>
          </Dialog>
        </div>
      )}
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex-grow">
          <Label htmlFor="search" className="block mb-1">Search</Label>
          <SearchBar 
            search={searchTerm} 
            setSearch={handleSearchChange}
          />
        </div>
        <div>
          <Label htmlFor="type-filter" className="block mb-1">Type</Label>
          <TypeFilter 
            typeFilter={searchParams.get('type') as "all" | "human" | "ai" || "all"} 
            setTypeFilter={handleTypeFilterChange} 
          />
        </div>
        {editMode && (
          <div>
            <Label htmlFor="published-filter" className="block mb-1">Status</Label>
            <Select 
              value={searchParams.get('published') || 'all'} 
              onValueChange={handlePublishedFilterChange}
            >
              <SelectTrigger id="published-filter" className="w-[120px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="unpublished">Unpublished</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        <div>
          <Label htmlFor="sort-by" className="block mb-1">Sort by</Label>
          <Select 
            value={searchParams.get('sortBy') || 'created'} 
            onValueChange={handleSortByChange}
          >
            <SelectTrigger id="sort-by" className="w-[120px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created">Date</SelectItem>
              <SelectItem value="title">Title</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="sort-order" className="block mb-1">Order</Label>
          <Button id="sort-order" variant="outline" onClick={handleSortOrderChange}>
            {searchParams.get('sortOrder') === 'asc' ? <ArrowUpIcon /> : <ArrowDownIcon />}
          </Button>
        </div>
      </div>
    </div>
  );
}