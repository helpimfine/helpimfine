import { Input } from "@/components/ui/input";

interface SearchBarProps {
  search: string;
  setSearch: (value: string) => void;
}

export function SearchBar({ search, setSearch }: SearchBarProps) {
  return (
    <Input
      type="text"
      placeholder="Search artworks..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="flex-grow"
    />
  );
}