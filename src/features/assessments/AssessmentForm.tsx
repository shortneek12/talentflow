// src/features/assessments/AssessmentForm.tsx
import { useForm, Controller } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import type { IAssessment } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
// import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
// import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

// API function to fetch the assessment structure
async function fetchAssessment(jobId: number): Promise<IAssessment> {
    const res = await fetch(`/assessments/${jobId}`);
    if (!res.ok) throw new Error("Failed to load the assessment.");
    return res.json();
}

// Function to handle form submission
async function submitAssessment(data: { jobId: number, responses: any }) {
    // This is a mock submission. It stores the response locally.
    console.log("Submitting assessment:", data);
    localStorage.setItem(`assessment-response-${data.jobId}`, JSON.stringify(data.responses));
    // Simulate API call
    return new Promise(resolve => setTimeout(resolve, 500));
}

export function AssessmentForm({ jobId }: { jobId: number }) {
  const { data: assessment, isLoading, error } = useQuery({
    queryKey: ['assessment', jobId],
    queryFn: () => fetchAssessment(jobId),
  });

  const { control, handleSubmit, watch, formState: { errors } } = useForm();
  
  const formValues = watch(); // Watch all form values for conditional logic

  const onSubmit = (data: any) => {
    toast.promise(submitAssessment({ jobId, responses: data }), {
        loading: 'Submitting your assessment...',
        success: 'Assessment submitted successfully!',
        error: 'Failed to submit assessment.',
    });
  };

  if (isLoading) return <p>Loading assessment...</p>;
  if (error) return <p className="text-destructive">Error: Could not load assessment.</p>;
  if (!assessment) return <p>No assessment found for this job.</p>;

  return (
    <Card>
        <CardHeader>
            <CardTitle>{assessment.title}</CardTitle>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {assessment.sections.map((section) => (
                <div key={section.id}>
                <h3 className="text-xl font-semibold border-b pb-2 mb-4">{section.title}</h3>
                <div className="space-y-6">
                    {section.questions.map((q) => {
                    // Example Conditional Logic: Show Q3 only if Q1 === "Yes"
                    // This is a simple example. Real-world logic could be more complex.
                    // For this demo, let's say a question with label "Explain why" depends on a previous question with ID 'q1'
                    const isVisible = !(q.label.includes("Explain") && formValues['q1'] !== 'Yes');
                    if (!isVisible) return null;

                    return (
                        <div key={q.id}>
                            <Label htmlFor={q.id}>
                                {q.label} {q.required && <span className="text-destructive">*</span>}
                            </Label>
                            <Controller
                                name={q.id}
                                control={control}
                                rules={{ 
                                    required: q.required ? 'This field is required' : false,
                                    maxLength: q.maxLength ? { value: q.maxLength, message: `Maximum length is ${q.maxLength}` } : undefined,
                                    min: q.range ? { value: q.range.min, message: `Minimum value is ${q.range.min}` } : undefined,
                                    max: q.range ? { value: q.range.max, message: `Maximum value is ${q.range.max}` } : undefined,
                                }}
                                render={({ field }) => {
                                    switch (q.type) {
                                        case 'short-text':
                                        case 'long-text':
                                            return <Textarea {...field} id={q.id} />;
                                        case 'numeric':
                                            return <Input {...field} id={q.id} type="number" />;
                                        case 'file-upload':
                                            return <Input id={q.id} type="file" disabled />; // Stubbed as per requirements
                                        default:
                                            return <Input {...field} id={q.id} />;
                                    }
                                }}
                            />
                            {errors[q.id] && <p className="text-sm text-destructive mt-1">{errors[q.id]?.message as string}</p>}
                        </div>
                    );
                    })}
                </div>
                </div>
            ))}
            <Button type="submit">Submit Assessment</Button>
            </form>
        </CardContent>
    </Card>
  );
}
