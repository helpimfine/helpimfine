import { Skeleton } from "@/components/ui/skeleton";

export function ArtworkSkeleton() {
  return (
    <div className="space-y-2">
      <div className="aspect-square w-full rounded-lg relative animate-pulse bg-muted/50 skeleton">
        <div className="absolute bottom-2 left-2 right-2 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    </div>
  );
}

export function ArtworkGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => (
        <ArtworkSkeleton key={i} />
      ))}
    </div>
  );
}