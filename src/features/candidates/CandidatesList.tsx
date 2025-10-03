// src/features/candidates/CandidatesList.tsx
import type { ICandidate } from "@/types";
import { useState, useMemo } from "react";
import { AutoSizer, List } from "react-virtualized";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce"; // ✅ added debounce hook

export function CandidatesList({ candidates }: { candidates: ICandidate[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300); // ✅ debounce

  const filteredCandidates = useMemo(() => {
    if (!debouncedSearchTerm) return candidates;
    return candidates.filter(
      (c) =>
        c.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [candidates, debouncedSearchTerm]); // ✅ depend on debounced term

  // Row renderer for the virtualized list
  const renderRow = ({ index, key, style }: any) => {
    const candidate = filteredCandidates[index];
    return (
      <div
        key={key}
        style={style}
        className="flex items-center p-2 border-b"
      >
        <div className="flex-1 font-medium">{candidate.name}</div>
        <div className="flex-1 text-muted-foreground">{candidate.email}</div>
        <div className="flex-1 capitalize">{candidate.stage}</div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[70vh]">
      <Input
        placeholder="Search by name or email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      <div className="flex-grow">
        <AutoSizer>
          {({ height, width }) => (
            <List
              width={width}
              height={height}
              rowCount={filteredCandidates.length}
              rowHeight={50}
              rowRenderer={renderRow}
            />
          )}
        </AutoSizer>
      </div>
    </div>
  );
}

// NOTE: react-virtualized has been largely replaced by libraries like react-window or tanstack-virtual.
// For simplicity, I've kept react-virtualized here. 
// You'll need: `npm install react-virtualized @types/react-virtualized`
