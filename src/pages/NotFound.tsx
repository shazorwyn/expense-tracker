import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center dark:bg-gray-950">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-600">
        <Compass size={32} />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">404</h1>
      <p className="mt-2 text-gray-500 dark:text-gray-400">The page you're looking for doesn't exist.</p>
      <Link to="/dashboard" className="mt-6">
        <Button>Back to Dashboard</Button>
      </Link>
    </div>
  );
}
