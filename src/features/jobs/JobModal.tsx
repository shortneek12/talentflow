// src/features/jobs/JobModal.tsx
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { 
    Button, 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogTitle, 
    TextField, 
    CircularProgress 
} from '@mui/material';

// Zod schema for form validation
const jobSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with dashes'),
  tags: z.string(), // Tags are validated as a single string before being split
});

// Infer the type from the Zod schema
type JobFormData = z.infer<typeof jobSchema>;

// Async function to create a new job via API call
async function createJob(newJob: { title: string; slug: string; tags: string[]; status: string; }) {
    const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newJob),
    });
    if (!response.ok) {
        // You can add more specific error handling here based on response status
        throw new Error('Failed to create job');
    }
    return response.json();
}

export function JobModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const queryClient = useQueryClient();
  
  // React Hook Form setup with Zod resolver
  const { control, handleSubmit, formState: { errors }, reset } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: '',
      slug: '',
      tags: '',
    },
  });

  // React Query mutation for creating the job
  const mutation = useMutation({
    mutationFn: createJob,
    onSuccess: () => {
        toast.success('Job created successfully! 🎉');
        // Invalidate the 'jobs' query to refetch the updated list
        queryClient.invalidateQueries({ queryKey: ['jobs'] });
        onClose(); // Close the modal
        reset();   // Reset the form fields
    },
    onError: (error) => {
        toast.error(error.message || 'An unexpected error occurred.');
    }
  });

  // Form submission handler
  const onSubmit = (data: JobFormData) => {
    const newJob = {
        title: data.title,
        slug: data.slug,
        // Split the tags string into an array of trimmed strings
        tags: data.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        status: 'active', // Set a default status
    };
    mutation.mutate(newJob);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Create New Job</DialogTitle>
        <DialogContent>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                autoFocus
                margin="dense"
                label="Job Title"
                type="text"
                fullWidth
                variant="outlined"
                error={!!errors.title}
                helperText={errors.title?.message}
              />
            )}
          />
          <Controller
            name="slug"
            control={control}
            render={({ field }) => (
                <TextField
                    {...field}
                    margin="dense"
                    label="Slug"
                    type="text"
                    fullWidth
                    variant="outlined"
                    error={!!errors.slug}
                    helperText={errors.slug?.message}
                />
            )}
           />
          <Controller
            name="tags"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                margin="dense"
                label="Tags (comma-separated)"
                type="text"
                fullWidth
                variant="outlined"
                error={!!errors.tags}
                helperText={errors.tags?.message}
              />
            )}
          />
        </DialogContent>
        <DialogActions sx={{ padding: '16px 24px' }}>
          <Button onClick={onClose} disabled={mutation.isPending}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={mutation.isPending}>
            {mutation.isPending ? <CircularProgress size={24} color="inherit" /> : 'Save Job'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}