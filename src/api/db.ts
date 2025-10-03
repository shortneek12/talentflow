// src/api/db.ts
import Dexie, { type Table } from 'dexie';
import type { IJob, ICandidate, IAssessment, ITimelineEvent } from '@/types';

export class TalentFlowDB extends Dexie {
  jobs!: Table<IJob, number>;
  candidates!: Table<ICandidate, number>;
  assessments!: Table<IAssessment, number>;
  timeline!: Table<ITimelineEvent, number>;

  constructor() {
    super('talentflowDB');
    this.version(1).stores({
      jobs: '++id, title, status, order',
      candidates: '++id, name, email, stage, jobId',
      assessments: '++id, jobId',
      timeline: '++id, candidateId',
    });
  }
}

export const db = new TalentFlowDB();