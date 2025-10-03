// src/pages/Jobs.tsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { JobsList } from '@/features/jobs/JobsList';
import { JobModal } from '@/features/jobs/JobModal';
import { Box, Button, Typography, CircularProgress, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import type { IJob } from '@/types';

async function fetchJobs(): Promise<IJob[]> {
  const res = await fetch("/jobs");
  if (!res.ok) throw new Error("Failed to fetch jobs");
  return res.json();
}

export function Jobs() {
  const { data: jobs, isLoading, error } = useQuery({ queryKey: ['jobs'], queryFn: fetchJobs });
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Jobs Board
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsModalOpen(true)}
        >
          Create Job
        </Button>
      </Box>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress />
        </Box>
      )}
      {error && <Alert severity="error">{(error as Error).message}</Alert>}
      
      {jobs && <JobsList jobs={jobs} />}

      <JobModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </Box>
  );
}