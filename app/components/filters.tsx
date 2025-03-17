"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { SearchBar } from "@/app/components/search-bar";
import { TypeFilter } from "@/app/components/type-filter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCallback, useState, useEffect, useMemo } from 'react';
import debounce from 'lodash/debounce';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusIcon, ArrowUpIcon, ArrowDownIcon } from "@radix-ui/react-icons";
import { ImageUpload } from "@/app/components/image-upload";
import { Label } from "@/components/ui/label";
import { useColors } from "@/app/context/color-context";
import { generateColorTones } from "@/utils/color-utils";

interface FiltersProps {
  editMode: boolean;
  onSearch: (term: string) => void;
}

export function Filters({ editMode, onSearch }: FiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { colorTones } = useColors();

  // Default colors if no artwork colors are set
  const defaultColors = ['#D3D3D3', '#62757f', '#4B4B4B', '#8A9A5B'];
  const defaultColorTones = defaultColors.map(color => generateColorTones(color));
  const currentColorTones = colorTones || defaultColorTones;

  const debouncedUpdateUrlParams = useCallback(
    (newParams: Record<string, string>) => {
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
    },
    [searchParams, router]
  );

  const debouncedSearch = useMemo(
    () => debounce(debouncedUpdateUrlParams, 300),
    [debouncedUpdateUrlParams]
  );

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    debouncedSearch({ search: value });
    onSearch(value);
  };
  const handleTypeFilterChange = (value: string) => debouncedUpdateUrlParams({ type: value });
  const handlePublishedFilterChange = (value: string) => debouncedUpdateUrlParams({ published: value });
  const handleSortByChange = (value: string) => debouncedUpdateUrlParams({ sortBy: value });
  const handleSortOrderChange = () => {
    const currentOrder = searchParams.get('sortOrder') || 'desc';
    debouncedUpdateUrlParams({ sortOrder: currentOrder === 'asc' ? 'desc' : 'asc' });
  };

  const handleUploadComplete = () => {
    setIsDialogOpen(false);
    router.refresh();
  };

  return (
    <div className="space-y-6 pb-6">
      {editMode && (
        <div className="flex justify-between items-center">
          <h2 className="text-6xl font-semibold" style={{ color: currentColorTones[1][3] }}>Dashboard</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="flex items-center"
                style={{ 
                  borderColor: currentColorTones[1][3],
                  color: currentColorTones[1][3]
                }}
              >
                <PlusIcon className="mr-2 h-4 w-4" /> Add New
              </Button>
            </DialogTrigger>
            
            <DialogContent 
              className="w-full max-w-4xl bg-card/20 backdrop-blur-xl border-none"
              style={{ 
                backgroundColor: `${currentColorTones[1][6]}80`,
                borderColor: currentColorTones[1][3]
              }}
            >
              <DialogTitle className="text-4xl" style={{ color: currentColorTones[1][3] }}>Add New Artwork</DialogTitle>
              <DialogDescription style={{ color: currentColorTones[1][3] }}>
                Add a new artwork to the gallery.
              </DialogDescription>
              <ImageUpload onUploadComplete={handleUploadComplete} />
            </DialogContent>
          </Dialog>
        </div>
      )}
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex-grow">
          <Label htmlFor="search" className="block mb-1" style={{ color: currentColorTones[1][3] }}>Search</Label>
          <SearchBar 
            search={searchTerm} 
            setSearch={handleSearchChange}
            style={{ 
              borderColor: currentColorTones[1][3],
              color: currentColorTones[1][3]
            }}
          />
        </div>
        <div>
          <Label htmlFor="type-filter" className="block mb-1" style={{ color: currentColorTones[1][3] }}>Type</Label>
          <TypeFilter 
            typeFilter={searchParams.get('type') as "all" | "human" | "ai" || "all"} 
            setTypeFilter={handleTypeFilterChange}
            style={{ 
              borderColor: currentColorTones[1][3],
              color: currentColorTones[1][3]
            }}
          />
        </div>
        {editMode && (
          <div>
            <Label htmlFor="published-filter" className="block mb-1" style={{ color: currentColorTones[1][3] }}>Status</Label>
            <Select 
              value={searchParams.get('published') || 'all'} 
              onValueChange={handlePublishedFilterChange}
            >
              <SelectTrigger 
                id="published-filter" 
                className="w-[120px] bg-transparent hover:bg-opacity-30 transition-colors backdrop-blur-sm"
                style={{ 
                  borderColor: currentColorTones[1][3],
                  color: currentColorTones[1][3],
                  backgroundColor: currentColorTones[1][3] ? `${currentColorTones[1][3]}20` : undefined
                }}
              >
                <SelectValue placeholder="Status" className="placeholder:text-inherit" style={{ color: currentColorTones[1][3] }} />
              </SelectTrigger>
              <SelectContent 
                className="backdrop-blur-md"
                style={{ 
                  backgroundColor: currentColorTones[1][3] ? `${currentColorTones[1][3]}10` : undefined,
                  borderColor: currentColorTones[1][3]
                }}
              >
                <SelectItem 
                  value="all"
                  className="hover:bg-opacity-30 transition-colors data-[highlighted]:bg-opacity-30"
                  style={{ 
                    color: currentColorTones[1][3],
                    backgroundColor: searchParams.get('published') === 'all' && currentColorTones[1][3] ? `${currentColorTones[1][3]}20` : 'transparent'
                  }}
                >
                  All
                </SelectItem>
                <SelectItem 
                  value="published"
                  className="hover:bg-opacity-30 transition-colors data-[highlighted]:bg-opacity-30"
                  style={{ 
                    color: currentColorTones[1][3],
                    backgroundColor: searchParams.get('published') === 'published' && currentColorTones[1][3] ? `${currentColorTones[1][3]}20` : 'transparent'
                  }}
                >
                  Published
                </SelectItem>
                <SelectItem 
                  value="unpublished"
                  className="hover:bg-opacity-30 transition-colors data-[highlighted]:bg-opacity-30"
                  style={{ 
                    color: currentColorTones[1][3],
                    backgroundColor: searchParams.get('published') === 'unpublished' && currentColorTones[1][3] ? `${currentColorTones[1][3]}20` : 'transparent'
                  }}
                >
                  Unpublished
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        <div>
          <Label htmlFor="sort-by" className="block mb-1" style={{ color: currentColorTones[1][3] }}>Sort by</Label>
          <Select 
            value={searchParams.get('sortBy') || 'created'} 
            onValueChange={handleSortByChange}
          >
            <SelectTrigger 
              id="sort-by" 
              className="w-[120px] bg-transparent hover:bg-opacity-30 transition-colors backdrop-blur-sm"
              style={{ 
                borderColor: currentColorTones[1][3],
                color: currentColorTones[1][3],
                backgroundColor: currentColorTones[1][3] ? `${currentColorTones[1][3]}20` : undefined
              }}
            >
              <SelectValue placeholder="Sort by" className="placeholder:text-inherit" style={{ color: currentColorTones[1][3] }} />
            </SelectTrigger>
            <SelectContent 
              className="backdrop-blur-md"
              style={{ 
                backgroundColor: currentColorTones[1][3] ? `${currentColorTones[1][3]}10` : undefined,
                borderColor: currentColorTones[1][3]
              }}
            >
              <SelectItem 
                value="created"
                className="hover:bg-opacity-30 transition-colors data-[highlighted]:bg-opacity-30"
                style={{ 
                  color: currentColorTones[1][3],
                  backgroundColor: searchParams.get('sortBy') === 'created' && currentColorTones[1][3] ? `${currentColorTones[1][3]}20` : 'transparent'
                }}
              >
                Date
              </SelectItem>
              <SelectItem 
                value="title"
                className="hover:bg-opacity-30 transition-colors data-[highlighted]:bg-opacity-30"
                style={{ 
                  color: currentColorTones[1][3],
                  backgroundColor: searchParams.get('sortBy') === 'title' && currentColorTones[1][3] ? `${currentColorTones[1][3]}20` : 'transparent'
                }}
              >
                Title
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="sort-order" className="block mb-1" style={{ color: currentColorTones[1][3] }}>Order</Label>
          <Button 
            id="sort-order" 
            variant="outline" 
            onClick={handleSortOrderChange}
            className="hover:bg-opacity-30 transition-colors"
            style={{ 
              borderColor: currentColorTones[1][3],
              color: currentColorTones[1][3],
              backgroundColor: currentColorTones[1][3] ? `${currentColorTones[1][3]}20` : undefined
            }}
          >
            {searchParams.get('sortOrder') === 'asc' ? <ArrowUpIcon /> : <ArrowDownIcon />}
          </Button>
        </div>
      </div>
    </div>
  );
}