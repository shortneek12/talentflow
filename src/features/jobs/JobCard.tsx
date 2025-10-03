// src/features/jobs/JobCard.tsx
import type { IJob } from "@/types";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Archive, Edit } from "lucide-react";

export function JobCard({ job }: { job: IJob }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{job.title}</CardTitle>
        <CardDescription>
          Status: <span className={job.status === 'active' ? 'text-green-500' : 'text-red-500'}>{job.status}</span>
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          {job.tags.map(tag => (
            <span key={tag} className="bg-secondary text-secondary-foreground text-xs font-semibold px-2 py-1 rounded-full">{tag}</span>
          ))}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon"><Edit className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon"><Archive className="h-4 w-4" /></Button>
        </div>
      </CardFooter>
    </Card>
  );
}