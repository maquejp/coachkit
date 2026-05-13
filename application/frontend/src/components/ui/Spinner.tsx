type SpinnerSize = 'sm' | 'md' | 'lg';

interface SpinnerProps {
  size?: SpinnerSize;
  centered?: boolean;
  className?: string;
}

const sizeMap: Record<SpinnerSize, string> = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-10 w-10 border-[3px]',
};

export function Spinner({ size = 'md', centered, className = '' }: SpinnerProps) {
  const spinner = (
    <div
      className={`animate-spin rounded-full border-primary-200 border-t-primary-600 ${sizeMap[size]} ${className}`}
    />
  );

  if (centered) {
    return <div className="flex items-center justify-center py-12">{spinner}</div>;
  }

  return spinner;
}
