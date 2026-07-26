import clsx from 'clsx';

export default function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClass = size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-10 w-10' : 'h-6 w-6';
  return (
    <div
      className={clsx('animate-spin rounded-full border-2 border-brand-200 border-t-brand-600', sizeClass)}
      role="status"
      aria-label="Loading"
    />
  );
}
