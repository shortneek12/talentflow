// src/features/candidates/CandidateProfile.tsx
import { useParams } from "react-router-dom";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
  Chip,
} from "@mui/material";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from "@mui/lab";
import { useState } from "react";
import type { ICandidate, ITimelineEvent } from "@/types";

// ---------------- Fetching Functions ----------------

async function fetchCandidate(candidateId: string): Promise<ICandidate> {
  const res = await fetch("/api/candidates");
  if (!res.ok) throw new Error("Failed to fetch candidates");
  const candidates: ICandidate[] = await res.json();
  const candidate = candidates.find((c) => c.id === Number(candidateId));
  if (!candidate) throw new Error("Candidate not found");
  return candidate;
}

async function fetchTimeline(
  candidateId: string
): Promise<ITimelineEvent[]> {
  const res = await fetch(`/api/candidates/${candidateId}/timeline`);
  if (!res.ok) throw new Error("Failed to fetch timeline");
  return res.json();
}

async function addNoteToTimeline(newNote: {
  candidateId: number;
  content: string;
}): Promise<ITimelineEvent> {
  const response = await fetch(`/api/candidates/${newNote.candidateId}/timeline`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newNote),
  });
  if (!response.ok) throw new Error("Failed to add note");
  return response.json();
}

// ---------------- Component ----------------

export default function CandidateProfile() {
  const { candidateId } = useParams<{ candidateId: string }>();
  const queryClient = useQueryClient();
  const [newNote, setNewNote] = useState("");

  const {
    data: candidate,
    isLoading: isLoadingCandidate,
    error: candidateError,
  } = useQuery({
    queryKey: ["candidate", candidateId],
    queryFn: () => fetchCandidate(candidateId!),
    enabled: !!candidateId,
  });

  const {
    data: timeline,
    isLoading: isLoadingTimeline,
    error: timelineError,
  } = useQuery({
    queryKey: ["timeline", candidateId],
    queryFn: () => fetchTimeline(candidateId!),
    enabled: !!candidateId,
  });

  const addNoteMutation = useMutation({
    mutationFn: addNoteToTimeline,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timeline", candidateId] });
      setNewNote("");
    },
  });

  const handleAddNote = () => {
    if (newNote.trim() && candidate) {
      addNoteMutation.mutate({
        candidateId: candidate.id,
        content: newNote,
      });
    }
  };

  // ---------------- Loading & Error States ----------------

  if (isLoadingCandidate || isLoadingTimeline) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (candidateError || timelineError) {
    return <Alert severity="error">Error loading data.</Alert>;
  }

  if (!candidate) {
    return <Alert severity="warning">Candidate not found.</Alert>;
  }

  // ---------------- Render ----------------

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '4fr 8fr' }, gap: 3 }}>
      {/* Candidate Info */}
      <Card>
        <CardHeader
          title={<Typography variant="h5">{candidate.name}</Typography>}
          subheader={candidate.email}
        />
        <CardContent>
          <Chip
            label={candidate.stage}
            color="primary"
            sx={{ textTransform: "capitalize" }}
          />
        </CardContent>
      </Card>

      {/* Candidate Timeline */}
      <Card>
        <CardHeader title="Timeline" />
        <CardContent>
            {/* Add Note Form */}
            <Box display="flex" gap={2} mb={3}>
              <TextField
                fullWidth
                multiline
                rows={2}
                placeholder="Add a note... Use @ to mention users (e.g., @JohnDoe)"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
              />
              <Button
                variant="contained"
                onClick={handleAddNote}
                disabled={addNoteMutation.isPending}
              >
                {addNoteMutation.isPending ? "Adding..." : "Add Note"}
              </Button>
            </Box>

            {/* Timeline List */}
            <Timeline position="right">
              {timeline?.map((event) => (
                <TimelineItem key={event.id}>
                  <TimelineSeparator>
                    <TimelineDot color="primary" />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(event.date).toLocaleString()}
                    </Typography>
                    <Typography
                      variant="body1"
                      dangerouslySetInnerHTML={{
                        __html: event.content.replace(
                          /(@\w+)/g,
                          '<strong style="color:#1976d2">$1</strong>'
                        ),
                      }}
                    />
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </CardContent>
        </Card>
      </Box>
  );
}
