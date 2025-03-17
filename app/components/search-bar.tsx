import { Input } from "@/components/ui/input";

interface SearchBarProps {
  search: string;
  setSearch: (value: string) => void;
  style?: React.CSSProperties;
}

export function SearchBar({ search, setSearch, style }: SearchBarProps) {
  return (
    <Input
      type="text"
      placeholder="Search artworks..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="flex-grow bg-transparent hover:bg-opacity-30 transition-colors placeholder:text-inherit"
      style={{
        ...style,
        backgroundColor: style?.borderColor ? `${style.borderColor}20` : undefined,
        color: style?.borderColor
      }}
    />
  );
}