// src/features/candidates/CandidateCard.tsx
import type { ICandidate } from "@/types";
import { Card, CardActionArea, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export function CandidateCard({ candidate }: { candidate: ICandidate }) {
  return (
    <Card variant="outlined">
      <CardActionArea
        component={Link}
        to={`/app/candidates/${candidate.id}`}
        sx={{ p: 2 }}
      >
        <Typography variant="subtitle1" fontWeight="bold" noWrap>
          {candidate.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {candidate.email}
        </Typography>
      </CardActionArea>
    </Card>
  );
}
