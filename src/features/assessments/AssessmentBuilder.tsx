// src/features/assessments/AssessmentBuilder.tsx
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { IAssessment, IJob, IQuestion, QuestionType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { v4 as uuidv4 } from 'uuid';
import { Textarea } from '@/components/ui/textarea';

// Zod Schema for validation
const questionSchema = z.object({
  id: z.string(),
  type: z.enum(['single-choice', 'multi-choice', 'short-text', 'long-text', 'numeric', 'file-upload']),
  label: z.string().min(1, 'Question label cannot be empty'),
  required: z.boolean(),
  options: z.array(z.string()).optional(),
});

const sectionSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Section title cannot be empty'),
  questions: z.array(questionSchema),
});

const assessmentSchema = z.object({
  title: z.string().min(1, 'Assessment title is required'),
  sections: z.array(sectionSchema),
});

type AssessmentFormData = z.infer<typeof assessmentSchema>;

async function fetchAssessment(jobId: number): Promise<IAssessment | null> {
    // In a real app, you might get a 404. Here, we just return null.
    const res = await fetch(`/assessments/${jobId}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Failed to fetch assessment");
    return res.json();
}

export function AssessmentBuilder({ jobId }: { jobId: number }) {
  const { data: assessment, isLoading } = useQuery({
    queryKey: ['assessment', jobId],
    queryFn: () => fetchAssessment(jobId),
  });

  const { control, register, handleSubmit, reset, watch, formState: { errors, isDirty } } = useForm<AssessmentFormData>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: { title: '', sections: [] },
  });

  const { fields: sections, append: appendSection, remove: removeSection } = useFieldArray({
    control,
    name: "sections",
  });

  // When assessment data loads from the server, reset the form
  useEffect(() => {
    if (assessment) {
      reset(assessment);
    } else {
        // If no assessment exists, start with a default one
        reset({ title: `Assessment for Job #${jobId}`, sections: [] });
    }
  }, [assessment, jobId, reset]);

  const onSubmit = (data: AssessmentFormData) => {
    // Save logic here (e.g., call a mutation)
    console.log("Saving data:", data);
    // Persist to localStorage for this demo
    localStorage.setItem(`assessment-${jobId}`, JSON.stringify(data));
    alert('Assessment state saved to local storage!');
  };
  
  const formValues = watch(); // For the live preview

  if (isLoading) return <p>Loading assessment builder...</p>;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Builder Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Build Assessment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="title">Assessment Title</Label>
              <Input id="title" {...register('title')} />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
            </div>

            {sections.map((section, sectionIndex) => (
              <Card key={section.id} className="bg-muted/50 p-4">
                <div className="flex justify-between items-center mb-4">
                  <Input {...register(`sections.${sectionIndex}.title`)} placeholder="Section Title" className="font-bold text-lg"/>
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeSection(sectionIndex)}><Trash2 className="h-4 w-4" /></Button>
                </div>
                
                <QuestionArray control={control} sectionIndex={sectionIndex} />

                <Button type="button" variant="outline" size="sm" onClick={() => {
                  const sectionsField = `sections.${sectionIndex}.questions` as const;
                  // @ts-ignore
                  appendQuestion(sectionsField, { id: uuidv4(), type: 'short-text', label: '', required: false });
                }}><Plus className="h-4 w-4 mr-2" />Add Question</Button>
              </Card>
            ))}

            <Button type="button" onClick={() => appendSection({ id: uuidv4(), title: 'New Section', questions: [] })}>
                <Plus className="h-4 w-4 mr-2" />Add Section
            </Button>
          </CardContent>
        </Card>
        <Button type="submit" className="mt-6" disabled={!isDirty}>Save Assessment</Button>
      </form>
      
      {/* Live Preview Pane */}
      <Card>
        <CardHeader>
          <CardTitle>Live Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className="text-2xl font-bold mb-4">{formValues.title}</h2>
          {formValues.sections?.map(section => (
              <div key={section.id} className="mb-6">
                  <h3 className="text-xl font-semibold border-b pb-2 mb-4">{section.title}</h3>
                  {section.questions?.map(q => (
                      <div key={q.id} className="mb-4">
                          <Label>{q.label} {q.required && <span className="text-red-500">*</span>}</Label>
                          {q.type === 'short-text' && <Input />}
                          {q.type === 'long-text' && <Textarea />}
                          {/* Render other question types */}
                      </div>
                  ))}
              </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// Sub-component to manage questions within a section
function QuestionArray({ control, sectionIndex }: { control: any; sectionIndex: number }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `sections.${sectionIndex}.questions`,
  });

  return (
    <div className="space-y-4 mb-4">
      {fields.map((question, qIndex) => (
        <div key={question.id} className="border p-3 rounded-md space-y-2">
            <div className="flex justify-between items-center">
                 <Input {...control.register(`sections.${sectionIndex}.questions.${qIndex}.label`)} placeholder="Question Label"/>
                 <Button type="button" variant="ghost" size="icon" onClick={() => remove(qIndex)}><Trash2 className="h-4 w-4" /></Button>
            </div>
            
            <div className="flex items-center gap-4">
                <Controller
                    control={control}
                    name={`sections.${sectionIndex}.questions.${qIndex}.type`}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Question Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="short-text">Short Text</SelectItem>
                                <SelectItem value="long-text">Long Text</SelectItem>
                                <SelectItem value="numeric">Numeric</SelectItem>
                                <SelectItem value="single-choice">Single Choice</SelectItem>
                                <SelectItem value="file-upload">File Upload</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
                <div className="flex items-center space-x-2">
                    <Controller
                        control={control}
                        name={`sections.${sectionIndex}.questions.${qIndex}.required`}
                        render={({ field }) => (
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                        )}
                    />
                    <Label>Required</Label>
                </div>
            </div>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => append({ id: uuidv4(), type: 'short-text', label: '', required: false })}>
          <Plus className="h-4 w-4 mr-2" />Add Question
      </Button>
    </div>
  );
}