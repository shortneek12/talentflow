// src/pages/Assessments.tsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { IJob } from '@/types';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Paper,
  Alert,
  type SelectChangeEvent
} from '@mui/material';
import { AssessmentBuilder } from '@/features/assessments/AssessmentBuilder';

async function fetchActiveJobs(): Promise<IJob[]> {
  const res = await fetch('/api/jobs');
  if (!res.ok) throw new Error('Failed to fetch jobs');
  const allJobs: IJob[] = await res.json();
  return allJobs.filter(job => job.status === 'active');
}

export function Assessments() {
  // Use empty string as initial state for MUI Select
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const { data: jobs, isLoading, error } = useQuery({
    queryKey: ['activeJobs'],
    queryFn: fetchActiveJobs,
  });

  const handleJobChange = (event: SelectChangeEvent) => {
    setSelectedJobId(event.target.value as string);
  };

  return (
    <Box>
      {/* Header with job selector */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Assessment Builder
        </Typography>

        {jobs && (
          <FormControl sx={{ minWidth: 300 }} size="small">
            <InputLabel id="job-select-label">Select a Job</InputLabel>
            <Select
              labelId="job-select-label"
              id="job-select"
              value={selectedJobId}
              label="Select a Job"
              onChange={handleJobChange}
            >
              {jobs.map(job => (
                <MenuItem key={job.id} value={String(job.id)}>
                  {job.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>

      {/* Loading and Error States */}
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress />
        </Box>
      )}
      {error && <Alert severity="error">{(error as Error).message}</Alert>}

      {/* Assessment builder or placeholder */}
      <Box sx={{ mt: 3 }}>
        {selectedJobId ? (
          <AssessmentBuilder jobId={Number(selectedJobId)} />
        ) : (
          !isLoading && ( // Only show placeholder if not loading
            <Paper sx={{ textAlign: 'center', py: 10, bgcolor: 'action.hover' }}>
              <Typography color="text.secondary">
                Please select a job to start building an assessment.
              </Typography>
            </Paper>
          )
        )}
      </Box>
    </Box>
  );
}