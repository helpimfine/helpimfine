import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TypeFilterProps {
  typeFilter: "all" | "human" | "ai";
  setTypeFilter: (value: "all" | "human" | "ai") => void;
}

export function TypeFilter({ typeFilter, setTypeFilter }: TypeFilterProps) {
  return (
    <Select value={typeFilter} onValueChange={setTypeFilter}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Filter by type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All</SelectItem>
        <SelectItem value="human">Human</SelectItem>
        <SelectItem value="ai">AI</SelectItem>
      </SelectContent>
    </Select>
  );
}