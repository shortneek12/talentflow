// src/api/server.ts
import { createServer, Model, Factory, ActiveModelSerializer } from 'miragejs';
import { faker } from '@faker-js/faker';

export function makeServer({ environment = 'development' } = {}) {
  return createServer({
    environment,

    // Serializer to handle nested relationships if you add them later
    serializers: {
        application: ActiveModelSerializer,
    },

    // 1. Define ALL your data models (like database tables)
    models: {
      job: Model,
      candidate: Model,
      assessment: Model,
      timeline: Model, // ✅ Added for timeline events
    },

    // 2. Create factories for each model for clean data generation
    factories: {
      job: Factory.extend({
        title() {
          return faker.person.jobTitle();
        },
        slug(i: number) {
          return `job-title-${i}`;
        },
        status(i: number) {
            return i % 5 === 0 ? 'archived' : 'active';
        },
        tags() {
            return faker.helpers.arrayElements(['React', 'TypeScript', 'Node.js', 'Remote'], { min: 1, max: 3 });
        },
        order(i: number) {
            return i + 1;
        }
      }),
      candidate: Factory.extend({ // ✅ Added candidate factory
        name() {
            return faker.person.fullName();
        },
        email() {
            return faker.internet.email();
        },
        stage() {
            return faker.helpers.arrayElement(['applied', 'screen', 'tech', 'offer', 'hired', 'rejected']);
        },
      }),
    },
    
    // 3. Seed the database with data for all models
    seeds(server) {
      server.createList('job', 25);
      
    server.createList('candidate', 1000).forEach(candidate => {
      const randomJob = faker.helpers.arrayElement(server.db.jobs);
      // Cast to any because Mirage's model typings here don't include
      // a jobId relationship property by default.
      candidate.update({ jobId: randomJob.id } as any);
    });

    // ✅ Seed a timeline event for the first candidate so the UI isn't empty
    server.create('timeline', ({ 
      candidateId: "1", // IDs in Mirage are strings 
      date: faker.date.past().toISOString(),
      type: 'status_change',
      content: 'Candidate applied for the position.'
    } as any));
    },

    // 4. Define ALL your API routes
    routes() {
      this.namespace = 'api';
      this.timing = 500;

      // --- JOBS ---
      this.get('/jobs', (schema) => {
        return schema.all('job').models; // ✅ Use .models to return a plain array
      });

      this.post('/jobs', (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        return schema.create('job', attrs);
      });
      
      this.patch('/jobs/:id/reorder', () => ({ success: true }));
      
      // --- CANDIDATES ---
      this.get('/candidates', (schema) => {
          return schema.all('candidate').models; // ✅ Use .models
      });

      // ✅ Added route for a single candidate
    this.get('/candidates/:id', (schema, request) => {
          const id = request.params.id;
          const candidate = schema.find('candidate', id);
      if (!candidate) return new Response(null, { status: 404 });
      return candidate;
      });

      // ✅ Added routes for the timeline
    this.get('/candidates/:id/timeline', (schema, request) => {
      const candidateId = request.params.id;
      return schema.where('timeline', { candidateId } as any).models;
    });

    this.post('/candidates/:id/timeline', (schema, request) => {
      const candidateId = request.params.id;
      const attrs = JSON.parse(request.requestBody);
      return schema.create('timeline', { ...(attrs as any), candidateId, date: new Date().toISOString() } as any);
    });

      // --- ASSESSMENTS ---
    this.get('/assessments/:jobId', (_schema, request) => {
          return {
              id: 1,
              jobId: request.params.jobId,
              title: `Assessment for Job #${request.params.jobId}`,
              sections: [],
          };
      });
    },
  });
}