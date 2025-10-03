// src/pages/Dashboard.tsx
import { useQuery } from "@tanstack/react-query";
import type { ICandidate, IJob } from "@/types";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Link } from "react-router-dom";


// Fetch jobs + candidates together
async function fetchAllData(): Promise<{ jobs: IJob[]; candidates: ICandidate[] }> {
  const [jobsRes, candidatesRes] = await Promise.all([
    fetch("/api/jobs"),
    fetch("/api/candidates"),
  ]);

  if (!jobsRes.ok || !candidatesRes.ok) {
    throw new Error("Failed to fetch dashboard data");
  }

  return {
    jobs: await jobsRes.json(),
    candidates: await candidatesRes.json(),
  };
}

export function Dashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboardData"],
    queryFn: fetchAllData,
  });

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">Error loading dashboard data.</Alert>;
  }

  const { jobs = [], candidates = [] } = data || {};

  const activeJobs = jobs.filter((job) => job.status === "active").length;
  const hiredCandidates = candidates.filter((c) => c.stage === "hired").length;

  const candidateStageCounts = candidates.reduce((acc, c) => {
    acc[c.stage] = (acc[c.stage] || 0) + 1;
    return acc;
  }, {} as Record<ICandidate["stage"], number>);

  const recentJobs = [...jobs].sort((a, b) => b.id - a.id).slice(0, 5);

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
        Dashboard
      </Typography>

      {/* High-level Stats Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
          <Card>
            <CardHeader title="Total Jobs" />
            <CardContent>
              <Typography variant="h4" fontWeight="bold">{jobs.length}</Typography>
              <Typography variant="body2" color="text.secondary">
                {activeJobs} active jobs
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Total Candidates" />
            <CardContent>
              <Typography variant="h4" fontWeight="bold">{candidates.length}</Typography>
              <Typography variant="body2" color="text.secondary">
                Across all stages
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Total Hired" />
            <CardContent>
              <Typography variant="h4" fontWeight="bold">{hiredCandidates}</Typography>
              <Typography variant="body2" color="text.secondary">
                Successful placements
              </Typography>
            </CardContent>
          </Card>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '7fr 5fr' }, gap: 3 }}>
        {/* Candidate Pipeline */}
        <Card>
          <CardHeader title="Candidate Pipeline" subheader="Breakdown by stage" />
          <CardContent>
            <List>
              {Object.entries(candidateStageCounts).map(([stage, count]) => (
                <ListItem key={stage} divider>
                  <ListItemText
                    primaryTypographyProps={{ sx: { textTransform: "capitalize" } }}
                    primary={stage}
                    secondary={`Count: ${count}`}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>

        {/* Recent Jobs */}
        <Card>
          <CardHeader title="Recent Jobs" subheader="The last 5 jobs created" />
          <CardContent>
            <List>
              {recentJobs.map((job) => (
                <ListItem
                  key={job.id}
                  divider
                  secondaryAction={
                    <Button
                      component={Link}
                      to={`/app/jobs/${job.id}`}
                      variant="outlined"
                      size="small"
                    >
                      View
                    </Button>
                  }
                >
                  <ListItemText
                    primary={job.title}
                    secondary={`Status: ${job.status}`}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}