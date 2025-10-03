// src/features/candidates/CandidatesList.tsx
import type { ICandidate } from "@/types";
import { useState, useMemo } from "react";
import { useDebounce } from "@/hooks/useDebounce";

// MUI Components
import {
  Box,
  TextField,
  Paper,
  ListItem,
  ListItemText,
  Typography,
  Chip,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

// Virtualization
import { Virtuoso } from "react-virtuoso";

export function CandidatesList({ candidates }: { candidates: ICandidate[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const filteredCandidates = useMemo(() => {
    if (!debouncedSearchTerm) return candidates;
    return candidates.filter(
      (c) =>
        c.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [candidates, debouncedSearchTerm]);

  const renderRow = (index: number) => {
    const candidate = filteredCandidates[index];
    return (
      <ListItem component="div" divider>
        <ListItemText
          primary={
            <Typography component="span" fontWeight="medium">
              {candidate.name}
            </Typography>
          }
          sx={{ flex: "1 1 33%" }}
        />
        <ListItemText
          primary={
            <Typography component="span" color="text.secondary">
              {candidate.email}
            </Typography>
          }
          sx={{ flex: "1 1 33%" }}
        />
        <Box sx={{ flex: "1 1 33%", textAlign: "left" }}>
          <Chip
            label={candidate.stage}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ textTransform: "capitalize" }}
          />
        </Box>
      </ListItem>
    );
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "70vh" }}>
      <TextField
        placeholder="Search by name or email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        variant="outlined"
        size="small"
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <Paper
        sx={{ flexGrow: 1, width: "100%", height: "100%" }}
        variant="outlined"
      >
        <Virtuoso
          style={{ height: "100%" }}
          totalCount={filteredCandidates.length}
          itemContent={renderRow}
          overscan={200}
        />
      </Paper>
    </Box>
  );
}
