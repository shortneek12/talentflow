// src/features/jobs/JobCard.tsx
import type { IJob } from "@/types";
import { Card, CardContent, CardHeader, Typography, Box, Chip, IconButton } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import ArchiveIcon from '@mui/icons-material/Archive';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

export function JobCard({ job }: { job: IJob }) {
  const isArchived = job.status === 'archived';
  return (
    <Card variant="outlined" sx={{ opacity: isArchived ? 0.6 : 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
         <Box sx={{ display: 'flex', alignItems: 'center', p: 1, cursor: 'grab' }}>
            <DragIndicatorIcon color="disabled" />
         </Box>
         <CardHeader
            title={<Typography variant="h6" component="div">{job.title}</Typography>}
            subheader={
                <Chip 
                    label={job.status} 
                    size="small"
                    color={isArchived ? 'default' : 'success'} 
                    sx={{ textTransform: 'capitalize', mt: 0.5 }}
                />
            }
            sx={{ flexGrow: 1 }}
         />
         <CardContent sx={{ display: 'flex', gap: 1 }}>
            {job.tags.map(tag => (
                <Chip key={tag} label={tag} size="small" variant="outlined" />
            ))}
         </CardContent>
         <Box sx={{ p: 1 }}>
            <IconButton size="small"><EditIcon /></IconButton>
            <IconButton size="small"><ArchiveIcon /></IconButton>
         </Box>
      </Box>
    </Card>
  );
}