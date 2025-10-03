// src/pages/Jobs.tsx
import { useQuery } from "@tanstack/react-query";
import { JobsList } from "@/features/jobs/JobsList";
import { Button } from "@/components/ui/button";
import { JobModal } from "@/features/jobs/JobModal";
import { useState } from "react";

async function fetchJobs() {
  const res = await fetch("/jobs");
  return res.json();
}

export function Jobs() {
  const { data: jobs, isLoading } = useQuery({ queryKey: ['jobs'], queryFn: fetchJobs });
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Jobs</h1>
        <Button onClick={() => setIsModalOpen(true)}>Create Job</Button>
      </div>
      {isLoading ? <p>Loading...</p> : <JobsList jobs={jobs} />}
      <JobModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}