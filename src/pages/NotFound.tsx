import { Button } from '@/components/ui/button';
import { TriangleAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <TriangleAlert className="w-16 h-16 text-destructive mb-4" />
      <h1 className="text-6xl font-bold text-indigo mb-2">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        Oops! The page you are looking for does not exist. It might have been moved or deleted.
      </p>
      <Link to="/jobs">
        <Button size="lg">
          Go Back to Jobs Board
        </Button>
      </Link>
    </div>
  );
}