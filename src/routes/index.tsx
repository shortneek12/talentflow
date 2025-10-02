// src/routes/index.tsx
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Jobs } from "@/pages/Jobs";
import { Candidates } from "@/pages/Candidates";
import { Assessments } from "@/pages/Assessments";
import { NotFound } from "@/pages/NotFound";
import { Layout } from "@/components/layout/Layout";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Jobs />} />
          <Route path="candidates" element={<Candidates />} />
          <Route path="assessments"
            element={<Assessments />}
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}