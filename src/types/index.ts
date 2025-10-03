// src/types/index.ts
export interface IJob {
  id: number;
  title: string;
  slug: string;
  status: 'active' | 'archived';
  tags: string[];
  order: number;
}

export interface ICandidate {
  id: number;
  name: string;
  email: string;
  stage: 'applied' | 'screen' | 'tech' | 'offer' | 'hired' | 'rejected';
  jobId: number;
}

export type QuestionType = 'single-choice' | 'multi-choice' | 'short-text' | 'long-text' | 'numeric' | 'file-upload';

export interface IQuestion {
  id: string;
  type: QuestionType;
  label: string;
  required: boolean;
  options?: string[]; // For single/multi-choice
  range?: { min: number; max: number }; // For numeric
  maxLength?: number; // For text
}

export interface IAssessmentSection {
  id: string;
  title: string;
  questions: IQuestion[];
}

export interface IAssessment {
  id: number;
  jobId: number;
  title: string;
  sections: IAssessmentSection[];
}

export interface ITimelineEvent {
    id: number;
    candidateId: number;
    date: string;
    type: 'status_change' | 'note';
    content: string;
}