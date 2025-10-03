// src/features/candidates/KanbanBoard.tsx
import type { ICandidate } from "@/types";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Box, Paper, Typography } from "@mui/material";
import { CandidateCard } from "./CandidateCard";

const STAGES: ICandidate["stage"][] = [
  "applied",
  "screen",
  "tech",
  "offer",
  "hired",
  "rejected",
];

export function KanbanBoard({ candidates }: { candidates: ICandidate[] }) {
  // Group candidates by stage
  const columns = STAGES.reduce((acc, stage) => {
    acc[stage] = candidates.filter((c) => c.stage === stage);
    return acc;
  }, {} as Record<ICandidate["stage"], ICandidate[]>);

  const onDragEnd = (result: any) => {
    // TODO: Implement drag and drop logic to update candidate stage
    console.log(result);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(3, 1fr)",
            lg: "repeat(6, 1fr)",
          },
        }}
      >
        {STAGES.map((stage) => (
          <Paper key={stage} sx={{ p: 1, bgcolor: "grey.100", height: "100%" }}>
            <Typography variant="h6" sx={{ textTransform: "capitalize", p: 1 }}>
              {stage}
            </Typography>
            <Droppable droppableId={stage}>
              {(provided) => (
                <Box
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  sx={{
                    minHeight: "500px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                    pt: 1,
                  }}
                >
                  {columns[stage].map((candidate, index) => (
                    <Draggable
                      key={candidate.id}
                      draggableId={String(candidate.id)}
                      index={index}
                    >
                      {(provided) => (
                        <Box
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <CandidateCard candidate={candidate} />
                        </Box>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          </Paper>
        ))}
      </Box>
    </DragDropContext>
  );
}
