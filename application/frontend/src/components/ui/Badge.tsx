type BadgeColor = 'primary' | 'accent' | 'warm' | 'gray' | 'green' | 'red';

interface BadgeProps {
  children: React.ReactNode;
  color?: BadgeColor;
  dot?: boolean;
  className?: string;
}

const colorMap: Record<BadgeColor, string> = {
  primary: 'bg-primary-100 text-primary-700',
  accent: 'bg-accent-100 text-accent-700',
  warm: 'bg-warm-100 text-warm-700',
  gray: 'bg-gray-100 text-gray-700',
  green: 'bg-green-100 text-green-700',
  red: 'bg-red-100 text-red-700',
};

const dotColorMap: Record<BadgeColor, string> = {
  primary: 'bg-primary-500',
  accent: 'bg-accent-500',
  warm: 'bg-warm-500',
  gray: 'bg-gray-500',
  green: 'bg-green-500',
  red: 'bg-red-500',
};

export function Badge({ children, color = 'gray', dot, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${colorMap[color]} ${className}`}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${dotColorMap[color]}`} />}
      {children}
    </span>
  );
}
