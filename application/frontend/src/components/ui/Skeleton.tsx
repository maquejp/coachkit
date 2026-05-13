type SkeletonVariant = 'text' | 'avatar' | 'card';

interface SkeletonProps {
  variant?: SkeletonVariant;
  lines?: number;
  className?: string;
}

const base = 'animate-pulse rounded bg-gray-200';

export function Skeleton({ variant = 'text', lines = 3, className = '' }: SkeletonProps) {
  if (variant === 'avatar') {
    return <div className={`${base} h-10 w-10 rounded-full ${className}`} />;
  }

  if (variant === 'card') {
    return (
      <div className={`space-y-3 rounded-xl border border-gray-100 p-5 ${className}`}>
        <div className={`${base} h-4 w-3/4`} />
        <div className={`${base} h-3 w-full`} />
        <div className={`${base} h-3 w-5/6`} />
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={`${base} h-3 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`} />
      ))}
    </div>
  );
}
