import { type ReactNode } from 'react';

type CardVariant = 'default' | 'elevated' | 'bordered';

interface CardProps {
  children: ReactNode;
  variant?: CardVariant;
  hover?: boolean;
  className?: string;
  header?: ReactNode;
  footer?: ReactNode;
}

const variantMap: Record<CardVariant, string> = {
  default: 'bg-white shadow-card',
  elevated: 'bg-white shadow-card-hover',
  bordered: 'border border-gray-200 bg-white',
};

export function Card({
  children,
  variant = 'default',
  hover,
  className = '',
  header,
  footer,
}: CardProps) {
  return (
    <div
      className={`overflow-hidden rounded-xl transition-shadow ${variantMap[variant]} ${hover ? 'hover:shadow-card-hover' : ''} ${className}`}
    >
      {header && <div className="border-b border-gray-100 px-5 py-4">{header}</div>}
      <div className="px-5 py-4">{children}</div>
      {footer && <div className="border-t border-gray-100 px-5 py-3">{footer}</div>}
    </div>
  );
}
