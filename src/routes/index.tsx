// src/routes/index.tsx
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Jobs } from '@/pages/Jobs';
import { Candidates } from '@/pages/Candidates';
import { Assessments } from '@/pages/Assessments';
import { NotFound } from '@/pages/NotFound';
import { Layout } from '@/components/layout/Layout';
import { Landing } from '@/pages/Landing';
import CandidateProfile from '@/features/candidates/CandidateProfile';
import { Dashboard } from '@/pages/Dashboard'; // <-- Import Dashboard

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={<Layout />}> {/* <-- Optional: nest app under /app */}
          <Route index element={<Dashboard />} /> {/* <-- Set Dashboard as index */}
          <Route path="jobs" element={<Jobs />} />
          <Route path="jobs/:jobId" element={<Jobs />} />
          <Route path="candidates" element={<Candidates />} />
          <Route path="candidates/:candidateId" element={<CandidateProfile />} />
          <Route path="assessments" element={<Assessments />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}