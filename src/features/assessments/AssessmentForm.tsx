// src/features/assessments/AssessmentForm.tsx
import { useForm, Controller } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import type { IAssessment } from "@/types";
import {
  Box,
  Button,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormGroup,
  Checkbox,
  Divider,
  FormHelperText,
} from "@mui/material";
import { toast } from "sonner";

// API function to fetch the assessment structure
async function fetchAssessment(jobId: number): Promise<IAssessment> {
  const res = await fetch(`/assessments/${jobId}`);
  if (!res.ok) throw new Error("Failed to load the assessment.");
  return res.json();
}

// Function to handle form submission
async function submitAssessment(data: {
  jobId: number;
  responses: any;
}): Promise<void> {
  // This is a mock submission. It stores the response locally.
  console.log("Submitting assessment:", data);
  localStorage.setItem(
    `assessment-response-${data.jobId}`,
    JSON.stringify(data.responses)
  );
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));
}

export function AssessmentForm({ jobId }: { jobId: number }) {
  const {
    data: assessment,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["assessment", jobId],
    queryFn: () => fetchAssessment(jobId),
  });

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const formValues = watch(); // For conditional logic

  const onSubmit = (data: any) => {
    toast.promise(submitAssessment({ jobId, responses: data }), {
      loading: "Submitting your assessment...",
      success: "Assessment submitted successfully!",
      error: "Failed to submit assessment.",
    });
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) return <Alert severity="error">{(error as Error).message}</Alert>;
  if (!assessment)
    return <Alert severity="info">No assessment found for this job.</Alert>;

  return (
    <Paper sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {assessment.title}
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {assessment.sections.map((section) => (
            <Box key={section.id}>
              <Typography variant="h5" component="h2">
                {section.title}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {section.questions.filter(q => {
                  // Conditional logic for visibility
                  return !(q.label.includes("Explain") && formValues[q.id] !== "Yes");
                }).map((q) => {

                  return (
                    <Controller
                      key={q.id}
                      name={q.id}
                      control={control}
                      rules={{
                        required: q.required ? "This field is required" : false,
                        // Other validation rules...
                      }}
                      render={({ field, fieldState }) => {
                        const hasError = !!fieldState.error;
                        const helperText = fieldState.error?.message;

                        // Default TextField as fallback
                        const defaultField = (
                          <TextField
                            {...field}
                            label={q.label}
                            fullWidth
                            error={hasError}
                            helperText={helperText || "Unsupported question type"}
                            disabled
                          />
                        );

                        switch (q.type) {
                          case "short-text":
                            return (
                              <TextField
                                {...field}
                                label={q.label}
                                fullWidth
                                error={hasError}
                                helperText={helperText}
                              />
                            );
                          case "long-text":
                            return (
                              <TextField
                                {...field}
                                label={q.label}
                                multiline
                                rows={4}
                                fullWidth
                                error={hasError}
                                helperText={helperText}
                              />
                            );
                          case "numeric":
                            return (
                              <TextField
                                {...field}
                                label={q.label}
                                type="number"
                                fullWidth
                                error={hasError}
                                helperText={helperText}
                              />
                            );
                          case "single-choice":
                            return (
                              <FormControl
                                component="fieldset"
                                error={hasError}
                              >
                                <FormLabel component="legend">
                                  {q.label}
                                </FormLabel>
                                <RadioGroup {...field}>
                                  {q.options?.map((option) => (
                                    <FormControlLabel
                                      key={option}
                                      value={option}
                                      control={<Radio />}
                                      label={option}
                                    />
                                  ))}
                                </RadioGroup>
                                <FormHelperText>{helperText}</FormHelperText>
                              </FormControl>
                            );
                          case "multi-choice":
                            return (
                              <FormControl
                                component="fieldset"
                                error={hasError}
                              >
                                <FormLabel component="legend">
                                  {q.label}
                                </FormLabel>
                                <FormGroup>
                                  {q.options?.map((option) => (
                                    <FormControlLabel
                                      key={option}
                                      control={
                                        <Checkbox
                                          checked={
                                            field.value?.includes(option) ||
                                            false
                                          }
                                          onChange={(e) => {
                                            const currentValues =
                                              field.value || [];
                                            const newValues = e.target.checked
                                              ? [...currentValues, option]
                                              : currentValues.filter(
                                                  (val: string) =>
                                                    val !== option
                                                );
                                            field.onChange(newValues);
                                          }}
                                        />
                                      }
                                      label={option}
                                    />
                                  ))}
                                </FormGroup>
                                <FormHelperText>{helperText}</FormHelperText>
                              </FormControl>
                            );
                          case "file-upload":
                            return (
                              <TextField
                                label={q.label}
                                type="file"
                                fullWidth
                                disabled
                                InputLabelProps={{ shrink: true }}
                                helperText="File uploads are currently disabled."
                              />
                            );
                          default:
                            return defaultField;
                        }
                      }}
                    />
                  );
                })}
              </Box>
            </Box>
          ))}
          <Button
            type="submit"
            variant="contained"
            size="large"
            sx={{ alignSelf: "flex-start" }}
          >
            Submit Assessment
          </Button>
        </Box>
      </form>
    </Paper>
  );
}
