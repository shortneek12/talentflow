// src/features/candidates/KanbanBoard.tsx
import type { ICandidate } from '@/types';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { CandidateCard } from './CandidateCard'; // ✅ use custom card instead of inline Card

const STAGES: ICandidate['stage'][] = [
  'applied',
  'screen',
  'tech',
  'offer',
  'hired',
  'rejected',
];

export function KanbanBoard({ candidates }: { candidates: ICandidate[] }) {
  // Group candidates by stage
  const columns = STAGES.reduce((acc, stage) => {
    acc[stage] = candidates.filter((c) => c.stage === stage);
    return acc;
  }, {} as Record<ICandidate['stage'], ICandidate[]>);

  const onDragEnd = (result: any) => {
    // Handle drag and drop logic to update candidate stage
    console.log(result);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-6 gap-4">
        {STAGES.map((stage) => (
          <Droppable key={stage} droppableId={stage}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="bg-muted p-2 rounded-lg flex flex-col"
              >
                <h3 className="font-bold p-2 capitalize">{stage}</h3>
                {columns[stage].map((candidate, index) => (
                  <Draggable
                    key={candidate.id}
                    draggableId={String(candidate.id)}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="mb-2"
                      >
                        <CandidateCard candidate={candidate} />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
