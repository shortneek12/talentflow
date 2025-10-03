// src/api/mock.ts
import { http, HttpResponse, delay } from 'msw';
import { setupWorker } from 'msw/browser';
import { db } from './db';
import type { IJob, ICandidate, IAssessment, ITimelineEvent } from '@/types';
import { faker } from '@faker-js/faker';

const STAGES: ICandidate['stage'][] = ['applied', 'screen', 'tech', 'offer', 'hired', 'rejected'];

// --- SEEDING LOGIC ---
async function seedDatabase() {
  const jobsCount = await db.jobs.count();
  if (jobsCount > 0) return; // Already seeded

  console.log('Seeding database...');

  const jobsToSeed: Omit<IJob, 'id'>[] = [];
  for (let i = 1; i <= 25; i++) {
    const jobTitle = faker.person.jobTitle();
    jobsToSeed.push({
      title: jobTitle,
      slug: faker.helpers.slugify(jobTitle).toLowerCase(),
      status: i % 5 === 0 ? 'archived' : 'active',
      tags: faker.helpers.arrayElements(
        ['React', 'TypeScript', 'Node.js', 'Remote', 'Full-time'],
        { min: 1, max: 3 }
      ),
      order: i,
    });
  }
  await db.jobs.bulkAdd(jobsToSeed as IJob[]);

  const candidatesToSeed: Omit<ICandidate, 'id'>[] = [];
  for (let i = 0; i < 1000; i++) {
    candidatesToSeed.push({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      stage: faker.helpers.arrayElement(STAGES),
      jobId: faker.number.int({ min: 1, max: 25 }),
    });
  }
  await db.candidates.bulkAdd(candidatesToSeed as ICandidate[]);

  const assessmentsToSeed: Omit<IAssessment, 'id'>[] = [];
  for (let i = 1; i <= 3; i++) {
    assessmentsToSeed.push({
      jobId: i,
      title: `Assessment for ${jobsToSeed[i - 1].title}`,
      sections: [
        {
          id: faker.string.uuid(),
          title: 'General Questions',
          questions: [
            {
              id: faker.string.uuid(),
              type: 'short-text',
              label: 'What is your expected salary?',
              required: true,
            },
            {
              id: faker.string.uuid(),
              type: 'long-text',
              label: 'Why do you want to work here?',
              required: true,
              maxLength: 500,
            },
          ],
        },
      ],
    });
  }
  await db.assessments.bulkAdd(assessmentsToSeed as IAssessment[]);
}

seedDatabase();

// --- API HANDLERS ---
const occasionallyFail = () => Math.random() < 0.08; // 8% error rate
const getLatency = () => faker.number.int({ min: 200, max: 1200 });

export const handlers = [
  // JOBS
  http.get('/jobs', async () => {
    const jobs = await db.jobs.orderBy('order').toArray();
    await delay(getLatency());
    return HttpResponse.json(jobs);
  }),

  http.post('/jobs', async ({ request }) => {
    await delay(getLatency());
    if (occasionallyFail()) return new HttpResponse(null, { status: 500 });

    const newJob = (await request.json()) as Omit<IJob, 'id' | 'order'>;
    const count = await db.jobs.count();
    const jobWithOrder = { ...newJob, order: count + 1 };
    const id = await db.jobs.add(jobWithOrder as IJob);
    return HttpResponse.json({ ...jobWithOrder, id }, { status: 201 });
  }),

  http.patch('/jobs/:id/reorder', async () => {
    await delay(getLatency());
    if (occasionallyFail()) {
      return HttpResponse.json({ message: 'Failed to reorder' }, { status: 500 });
    }
    // In a real app, you'd update the order of all affected jobs.
    // For this mock, we'll just acknowledge it. The client-side logic handles the optimistic update.
    return new HttpResponse(null, { status: 200 });
  }),

  // CANDIDATES
  http.get('/candidates', async ({ request }) => {
    const url = new URL(request.url);
    const stage = url.searchParams.get('stage');
    let candidates;
    if (stage) {
      candidates = await db.candidates.where('stage').equals(stage).toArray();
    } else {
      candidates = await db.candidates.toArray();
    }
    await delay(getLatency());
    return HttpResponse.json(candidates);
  }),

  http.get('/candidates/:id/timeline', async ({ params }) => {
    const { id } = params;
    const timeline = await db.timeline.where('candidateId').equals(Number(id)).toArray();
    await delay(getLatency());
    return HttpResponse.json(timeline);
  }),

  // --- NEW: Add note to candidate timeline ---
  http.post('/candidates/:id/timeline', async ({ request, params }) => {
    await delay(getLatency());
    if (occasionallyFail()) {
      return new HttpResponse(null, { status: 500 });
    }

    const { id } = params;
    const { content } = (await request.json()) as { content: string };

    const newEvent: Omit<ITimelineEvent, 'id'> = {
      candidateId: Number(id),
      date: new Date().toISOString(),
      type: 'note',
      content,
    };

    const eventId = await db.timeline.add(newEvent as ITimelineEvent);

    return HttpResponse.json({ ...newEvent, id: eventId }, { status: 201 });
  }),

  // ASSESSMENTS
  http.get('/assessments/:jobId', async ({ params }) => {
    const { jobId } = params;
    const assessment = await db.assessments.get({ jobId: Number(jobId) });
    await delay(getLatency());
    return HttpResponse.json(assessment);
  }),

  http.put('/assessments/:jobId', async ({ request, params }) => {
    await delay(getLatency());
    if (occasionallyFail()) return new HttpResponse(null, { status: 500 });

    const { jobId } = params;
    const data = (await request.json()) as Partial<IAssessment>;
    await db.assessments.update(Number(jobId), data);
    return HttpResponse.json(data);
  }),
];

export const worker = setupWorker(...handlers);
