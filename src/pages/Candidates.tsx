// src/pages/Candidates.tsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CandidatesList } from '@/features/candidates/CandidatesList';
import { KanbanBoard } from '@/features/candidates/KanbanBoard';
import { Box, Typography, ToggleButton, ToggleButtonGroup, CircularProgress, Alert } from '@mui/material';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewKanbanIcon from '@mui/icons-material/ViewKanban';
import type { ICandidate } from '@/types';

async function fetchCandidates(): Promise<ICandidate[]> {
  const response = await fetch('/api/candidates');
  if (!response.ok) {
    throw new Error('Failed to fetch candidates');
  }
  return response.json();
}

export function Candidates() {
  const [view, setView] = useState<'list' | 'board'>('list');
  const { data: candidates, isLoading, error } = useQuery<ICandidate[], Error>({ 
    queryKey: ['candidates'], 
    queryFn: fetchCandidates 
  });

  const handleViewChange = (_: React.MouseEvent<HTMLElement>, newView: 'list' | 'board' | null) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Candidates
        </Typography>
        <ToggleButtonGroup value={view} exclusive onChange={handleViewChange}>
          <ToggleButton value="list" aria-label="list view">
            <ViewListIcon />
          </ToggleButton>
          <ToggleButton value="board" aria-label="kanban board view">
            <ViewKanbanIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {isLoading && <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>}
      {error && <Alert severity="error">{(error as Error).message}</Alert>}
      
      {candidates && (
        view === 'list' ? <CandidatesList candidates={candidates} /> : <KanbanBoard candidates={candidates} />
      )}
    </Box>
  );
}