import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TypeFilterProps {
  typeFilter: "all" | "human" | "ai";
  setTypeFilter: (value: "all" | "human" | "ai") => void;
  style?: React.CSSProperties;
}

export function TypeFilter({ typeFilter, setTypeFilter, style }: TypeFilterProps) {
  return (
    <Select value={typeFilter} onValueChange={setTypeFilter}>
      <SelectTrigger 
        className="w-[180px] bg-transparent hover:bg-opacity-30 transition-colors backdrop-blur-sm" 
        style={{
          ...style,
          backgroundColor: `${style?.borderColor}20`,
          color: style?.borderColor
        }}
      >
        <SelectValue placeholder="Filter by type" className="placeholder:text-inherit" style={{ color: style?.borderColor }} />
      </SelectTrigger>
      <SelectContent 
        className="backdrop-blur-md"
        style={{
          backgroundColor: `${style?.borderColor}10`,
          borderColor: style?.borderColor
        }}
      >
        <SelectItem 
          value="all"
          className="hover:bg-opacity-30 transition-colors data-[highlighted]:bg-opacity-30"
          style={{ 
            color: style?.borderColor,
            backgroundColor: typeFilter === 'all' ? `${style?.borderColor}20` : 'transparent'
          }}
        >
          All
        </SelectItem>
        <SelectItem 
          value="human"
          className="hover:bg-opacity-30 transition-colors data-[highlighted]:bg-opacity-30"
          style={{ 
            color: style?.borderColor,
            backgroundColor: typeFilter === 'human' ? `${style?.borderColor}20` : 'transparent'
          }}
        >
          Human
        </SelectItem>
        <SelectItem 
          value="ai"
          className="hover:bg-opacity-30 transition-colors data-[highlighted]:bg-opacity-30"
          style={{ 
            color: style?.borderColor,
            backgroundColor: typeFilter === 'ai' ? `${style?.borderColor}20` : 'transparent'
          }}
        >
          AI
        </SelectItem>
      </SelectContent>
    </Select>
  );
}