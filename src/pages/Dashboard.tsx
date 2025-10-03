// src/pages/Dashboard.tsx
import { useQuery } from '@tanstack/react-query';
import type { ICandidate, IJob } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Briefcase, Users, CheckCircle, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

// We can reuse the existing fetching functions for efficiency
async function fetchAllData(): Promise<{ jobs: IJob[]; candidates: ICandidate[] }> {
  const [jobsRes, candidatesRes] = await Promise.all([
    fetch('/jobs'),
    fetch('/candidates'),
  ]);

  if (!jobsRes.ok || !candidatesRes.ok) {
    throw new Error('Failed to fetch dashboard data');
  }

  return {
    jobs: await jobsRes.json(),
    candidates: await candidatesRes.json(),
  };
}

export function Dashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboardData'],
    queryFn: fetchAllData,
  });

  if (isLoading) {
    return <div>Loading Dashboard...</div>;
  }

  if (error) {
    return <div className="text-destructive">Error loading dashboard data.</div>;
  }

  const { jobs = [], candidates = [] } = data || {};

  const activeJobs = jobs.filter(job => job.status === 'active').length;
  const hiredCandidates = candidates.filter(candidate => candidate.stage === 'hired').length;

  const candidateStageCounts = candidates.reduce((acc, candidate) => {
    acc[candidate.stage] = (acc[candidate.stage] || 0) + 1;
    return acc;
  }, {} as Record<ICandidate['stage'], number>);

  const recentJobs = [...jobs].sort((a, b) => b.id - a.id).slice(0, 5);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      {/* High-level Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobs.length}</div>
            <p className="text-xs text-muted-foreground">{activeJobs} active jobs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{candidates.length}</div>
            <p className="text-xs text-muted-foreground">Across all stages</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hired</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{hiredCandidates}</div>
            <p className="text-xs text-muted-foreground">Successful placements</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Candidate Pipeline Card */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Candidate Pipeline</CardTitle>
            <CardDescription>A breakdown of candidates by their current stage.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {Object.entries(candidateStageCounts).map(([stage, count]) => (
                <li key={stage} className="flex justify-between items-center text-sm">
                  <span className="capitalize">{stage}</span>
                  <span className="font-semibold">{count}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Recent Jobs Card */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Jobs</CardTitle>
            <CardDescription>The last 5 jobs created.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {recentJobs.map(job => (
                <li key={job.id} className="flex items-center">
                  <div className="flex-grow">
                    <p className="font-medium">{job.title}</p>
                    <p className={`text-xs ${job.status === 'active' ? 'text-green-500' : 'text-gray-500'}`}>
                      Status: {job.status}
                    </p>
                  </div>
                  <Link to={`/jobs/${job.id}`}>
                    <Button variant="outline" size="sm">View</Button>
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}