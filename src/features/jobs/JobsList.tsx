// src/features/jobs/JobsList.tsx
import type { IJob } from "@/types";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { JobCard } from "./JobCard";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

async function reorderJobsAPI(variables: { jobId: number; from: number; to: number }) {
  // Simulate API call
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
      
      // Optimistically update the UI
      queryClient.setQueryData<IJob[]>(['jobs'], old => {
        if (!old) return [];
        const movedItem = old.find(job => job.id === newOrder.jobId);
        if (!movedItem) return old;
        
        const remainingItems = old.filter(job => job.id !== newOrder.jobId);
        const newJobs = [...remainingItems];
        newJobs.splice(newOrder.to, 0, movedItem);
        
        // Update order property for persistence
        return newJobs.map((job, index) => ({ ...job, order: index + 1 }));
      });

      return { previousJobs };
    },
    onError: (err, newOrder, context) => {
      toast.error("Reorder failed, rolling back.");
      // Rollback on failure
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
          <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
            {jobs?.map((job, index) => (
              <Draggable key={job.id} draggableId={String(job.id)} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <JobCard job={job} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}