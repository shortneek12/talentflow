// src/features/assessments/AssessmentBuilder.tsx
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { v4 as uuidv4 } from "uuid";
import * as z from "zod";
import type { IAssessment } from "@/types";

// Zod Schemas
const questionSchema = z.object({
  id: z.string(),
  type: z.enum([
    "short-text",
    "long-text",
    "numeric",
    "single-choice",
    "multi-choice",
    "file-upload",
  ]),
  label: z.string().min(1, "Question label cannot be empty"),
  required: z.boolean(),
  options: z.array(z.string()).optional(),
});

const sectionSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Section title cannot be empty"),
  questions: z.array(questionSchema),
});

const assessmentSchema = z.object({
  title: z.string().min(1, "Assessment title is required"),
  sections: z.array(sectionSchema),
});

type AssessmentFormData = z.infer<typeof assessmentSchema>;

async function fetchAssessment(jobId: number): Promise<IAssessment | null> {
  const res = await fetch(`/api/assessments/${jobId}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch assessment");
  return res.json();
}

export function AssessmentBuilder({ jobId }: { jobId: number }) {
  const { data: assessment, isLoading } = useQuery({
    queryKey: ["assessment", jobId],
    queryFn: () => fetchAssessment(jobId),
  });

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<AssessmentFormData>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: { title: "", sections: [] },
  });

  const {
    fields: sections,
    append: appendSection,
    remove: removeSection,
  } = useFieldArray({
    control,
    name: "sections",
  });

  useEffect(() => {
    if (assessment) reset(assessment);
    else reset({ title: `Assessment for Job #${jobId}`, sections: [] });
  }, [assessment, jobId, reset]);

  const onSubmit = (data: AssessmentFormData) => {
    console.log("Saving assessment:", data);
    localStorage.setItem(`assessment-${jobId}`, JSON.stringify(data));
    alert("Assessment saved!");
  };

  const formValues = watch();

  if (isLoading) return <Typography>Loading assessment...</Typography>;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: {
            xs: "1fr",
            md: "7fr 5fr",
          },
        }}
      >
        {/* Builder Form */}
        <Box>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Build Assessment
            </Typography>
            <TextField
              label="Assessment Title"
              fullWidth
              variant="outlined"
              margin="normal"
              {...register("title")}
              error={!!errors.title}
              helperText={errors.title?.message}
            />

            {sections.map((section, sectionIndex) => (
              <Paper key={section.id} sx={{ p: 2, my: 2 }} variant="outlined">
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <TextField
                    placeholder="Section Title"
                    variant="outlined"
                    fullWidth
                    {...register(`sections.${sectionIndex}.title`)}
                  />
                  <IconButton onClick={() => removeSection(sectionIndex)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>

                <QuestionArray control={control} sectionIndex={sectionIndex} />

                <Button
                  startIcon={<AddIcon />}
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    const questionsField =
                      `sections.${sectionIndex}.questions` as const;
                    // @ts-ignore
                    appendQuestion(questionsField, {
                      id: uuidv4(),
                      type: "short-text",
                      label: "",
                      required: false,
                    });
                  }}
                >
                  Add Question
                </Button>
              </Paper>
            ))}

            <Button
              startIcon={<AddIcon />}
              variant="contained"
              onClick={() =>
                appendSection({
                  id: uuidv4(),
                  title: "New Section",
                  questions: [],
                })
              }
              sx={{ mt: 2 }}
            >
              Add Section
            </Button>
          </Paper>
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 3 }}
            disabled={!isDirty}
          >
            Save Assessment
          </Button>
        </Box>

        {/* Live Preview */}
        <Paper sx={{ p: 3, position: "sticky", top: "20px" }}>
          <Typography variant="h5" gutterBottom>
            Live Preview
          </Typography>
          <Typography variant="h6">{formValues.title}</Typography>
          {formValues.sections?.map((section) => (
            <Box key={section.id} sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                {section.title}
              </Typography>
              {section.questions?.map((q) => (
                <Box key={q.id} sx={{ mb: 2 }}>
                  <Typography>
                    {q.label}
                    {q.required && "*"}
                  </Typography>
                  {q.type === "short-text" && (
                    <TextField fullWidth size="small" />
                  )}
                  {q.type === "long-text" && (
                    <TextField fullWidth size="small" multiline rows={3} />
                  )}
                  {/* Add other question types as needed */}
                </Box>
              ))}
            </Box>
          ))}
        </Paper>
      </Box>
    </form>
  );
}

// QuestionArray Sub-component
function QuestionArray({
  control,
  sectionIndex,
}: {
  control: any;
  sectionIndex: number;
}) {
  const { fields } = useFieldArray({
    control,
    name: `sections.${sectionIndex}.questions`,
  });

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 2 }}>
      {fields.map((question) => (
        <Paper key={question.id} sx={{ p: 2, border: "1px solid #ccc" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 2,
            }}
          >
            <TextField
              fullWidth
              label="Question"
              variant="outlined"
              size="small"
            />
            <IconButton size="small">
              <DeleteIcon />
            </IconButton>
          </Box>
        </Paper>
      ))}
    </Box>
  );
}
