// src/features/jobs/JobsList.tsx
import type { IJob } from "@/types";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { JobCard } from "./JobCard";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Box } from "@mui/material";

async function reorderJobsAPI(variables: { jobId: number; from: number; to: number }) {
  const response = await fetch(`/jobs/${variables.jobId}/reorder`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fromOrder: variables.from, toOrder: variables.to }),
  });
  if (!response.ok) {
    throw new Error('Failed to reorder jobs');
  }
  return response.json();
}

export function JobsList({ jobs }: { jobs: IJob[] }) {
  const queryClient = useQueryClient();

  const reorderMutation = useMutation({
    mutationFn: reorderJobsAPI,
    onMutate: async (newOrder: { jobId: number; from: number; to: number }) => {
      await queryClient.cancelQueries({ queryKey: ['jobs'] });
      const previousJobs = queryClient.getQueryData<IJob[]>(['jobs']);

      // Optimistically update
      queryClient.setQueryData<IJob[]>(['jobs'], old => {
        if (!old) return [];
        const movedItem = old.find(job => job.id === newOrder.jobId);
        if (!movedItem) return old;

        const remainingItems = old.filter(job => job.id !== newOrder.jobId);
        const newJobs = [...remainingItems];
        newJobs.splice(newOrder.to, 0, movedItem);

        // Update order field for persistence
        return newJobs.map((job, index) => ({ ...job, order: index + 1 }));
      });

      return { previousJobs };
    },
    onError: (_err, _newOrder, context) => {
      toast.error("Reorder failed, rolling back.");
      if (context?.previousJobs) {
        queryClient.setQueryData(['jobs'], context.previousJobs);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;

    reorderMutation.mutate({
      jobId: Number(draggableId),
      from: source.index,
      to: destination.index,
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="jobs">
        {(provided) => (
          <Box
            {...provided.droppableProps}
            ref={provided.innerRef}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            {jobs?.map((job, index) => (
              <Draggable key={job.id} draggableId={String(job.id)} index={index}>
                {(provided) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <JobCard job={job} />
                  </Box>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </DragDropContext>
  );
}
