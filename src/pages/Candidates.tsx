// src/pages/Candidates.tsx
import { useQuery } from "@tanstack/react-query";
import { CandidatesList } from "@/features/candidates/CandidatesList";
import { KanbanBoard } from "@/features/candidates/KanbanBoard";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List } from "lucide-react";
import type { ICandidate } from "@/types";

async function fetchCandidates(): Promise<ICandidate[]> {
  const res = await fetch("/candidates");
  if (!res.ok) throw new Error("Failed to fetch candidates");
  return res.json();
}

export function Candidates() {
  const [view, setView] = useState<'list' | 'board'>('list');
  const { data: candidates, isLoading, error } = useQuery({ 
    queryKey: ['candidates'], 
    queryFn: fetchCandidates 
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Candidates</h1>
        <div>
          <Button variant="outline" size="icon" onClick={() => setView('list')} className={view === 'list' ? 'bg-accent' : ''}>
            <List className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => setView('board')} className={view === 'board' ? 'bg-accent' : ''}>
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {isLoading && <p>Loading candidates...</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}
      
      {candidates && view === 'list' && <CandidatesList candidates={candidates} />}
      {candidates && view === 'board' && <KanbanBoard candidates={candidates} />}
    </div>
  );
}