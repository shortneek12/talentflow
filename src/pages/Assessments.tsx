// src/pages/Assessments.tsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { IJob } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AssessmentBuilder } from '@/features/assessments/AssessmentBuilder';

async function fetchActiveJobs(): Promise<IJob[]> {
    const res = await fetch("/jobs");
    if (!res.ok) throw new Error("Failed to fetch jobs");
    const allJobs: IJob[] = await res.json();
    return allJobs.filter(job => job.status === 'active');
}

export function Assessments() {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const { data: jobs, isLoading } = useQuery({ 
    queryKey: ['activeJobs'], 
    queryFn: fetchActiveJobs 
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Assessment Builder</h1>
        {jobs && (
            <Select onValueChange={setSelectedJobId}>
                <SelectTrigger className="w-[280px]">
                    <SelectValue placeholder="Select a job to build an assessment..." />
                </SelectTrigger>
                <SelectContent>
                    {jobs.map(job => (
                        <SelectItem key={job.id} value={String(job.id)}>
                            {job.title}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        )}
      </div>

      {isLoading && <p>Loading jobs...</p>}
      
      {selectedJobId ? (
        <AssessmentBuilder jobId={Number(selectedJobId)} />
      ) : (
        <div className="text-center py-20 bg-muted rounded-lg">
            <p className="text-muted-foreground">Please select a job to start building an assessment.</p>
        </div>
      )}
    </div>
  );
}