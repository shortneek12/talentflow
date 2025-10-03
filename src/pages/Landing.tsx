// src/pages/Landing.tsx
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Landing() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-licorice text-wisteria p-8 text-center">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo via-transparent to-licorice opacity-50"></div>
      <div className="z-10">
        <h1 className="text-6xl md:text-8xl font-bold mb-4 font-sans tracking-tight">
          TalentFlow
        </h1>
        <p className="text-xl md:text-2xl text-wisteria mb-8 max-w-2xl mx-auto">
          A streamlined, front-end-only hiring platform to manage jobs, candidates, and assessments with ease.
        </p>
        <Link to="/app"> {/* updated from /jobs to /app */}
          <Button size="lg" className="bg-wisteria text-indigo hover:bg-wisteria/90 text-lg font-semibold px-8 py-6">
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
      <footer className="absolute bottom-4 text-wisteria/50">
        Built with React, Vite, and Tailwind CSS.
      </footer>
    </div>
  );
}
