// src/features/candidates/CandidateProfile.tsx
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { ICandidate, ITimelineEvent } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { MessageSquare, Calendar, User } from 'lucide-react';
import { useState } from 'react';

// Mock fetching a single candidate. In a real app, this would be a separate API call.
async function fetchCandidate(candidateId: string): Promise<ICandidate> {
  const res = await fetch('/candidates');
  if (!res.ok) throw new Error("Failed to fetch candidates");
  const candidates: ICandidate[] = await res.json();
  const candidate = candidates.find(c => c.id === Number(candidateId));
  if (!candidate) throw new Error("Candidate not found");
  return candidate;
}

async function fetchTimeline(candidateId: string): Promise<ITimelineEvent[]> {
    const res = await fetch(`/candidates/${candidateId}/timeline`);
    if (!res.ok) throw new Error("Failed to fetch timeline");
    return res.json();
}

async function addNoteToTimeline(newNote: { candidateId: number, content: string }): Promise<ITimelineEvent> {
    const response = await fetch(`/candidates/${newNote.candidateId}/timeline`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNote),
    });
    if (!response.ok) throw new Error('Failed to add note');
    return response.json();
}

export default function CandidateProfile() {
  const { candidateId } = useParams<{ candidateId: string }>();
  const queryClient = useQueryClient();
  const [newNote, setNewNote] = useState('');

  const { data: candidate, isLoading: isLoadingCandidate, error: candidateError } = useQuery({
    queryKey: ['candidate', candidateId],
    queryFn: () => fetchCandidate(candidateId!),
    enabled: !!candidateId,
  });

  const { data: timeline, isLoading: isLoadingTimeline, error: timelineError } = useQuery({
    queryKey: ['timeline', candidateId],
    queryFn: () => fetchTimeline(candidateId!),
    enabled: !!candidateId,
  });

  const addNoteMutation = useMutation({
    mutationFn: addNoteToTimeline,
    onSuccess: () => {
        toast.success("Note added successfully!");
        queryClient.invalidateQueries({ queryKey: ['timeline', candidateId] });
        setNewNote('');
    },
    onError: (error) => {
        toast.error(error.message);
    }
  });

  const handleAddNote = () => {
    if (newNote.trim() && candidate) {
        addNoteMutation.mutate({ candidateId: candidate.id, content: newNote });
    }
  };
  
  if (isLoadingCandidate || isLoadingTimeline) return <div>Loading profile...</div>;
  if (candidateError || timelineError) return <div className="text-red-500">Error loading data.</div>;
  if (!candidate) return <div>Candidate not found.</div>;

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{candidate.name}</CardTitle>
            <CardDescription>{candidate.email}</CardDescription>
          </CardHeader>
          <CardContent>
            <p><strong>Status:</strong> <span className="capitalize bg-accent text-accent-foreground px-2 py-1 rounded-md">{candidate.stage}</span></p>
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mb-6">
                <Textarea 
                    placeholder="Add a note... Use @ to mention users (e.g., @JohnDoe)"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                />
                <Button onClick={handleAddNote} disabled={addNoteMutation.isPending}>
                    {addNoteMutation.isPending ? 'Adding...' : 'Add Note'}
                </Button>
            </div>
            <div className="relative pl-6 after:absolute after:inset-y-0 after:w-px after:bg-border after:left-2">
              {timeline?.map((event, index) => (
                <div key={event.id} className="relative mb-6">
                    <div className="absolute w-4 h-4 bg-primary rounded-full -left-[1.10rem] mt-1 border-4 border-background" />
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        {new Date(event.date).toLocaleString()}
                    </p>
                    <p className="mt-2" dangerouslySetInnerHTML={{
                        __html: event.content.replace(/(@\w+)/g, '<strong class="text-indigo">$1</strong>')
                    }}></p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}