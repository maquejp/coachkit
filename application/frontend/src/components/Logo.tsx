import { Link } from 'react-router-dom';

interface LogoProps {
  showText?: boolean;
  className?: string;
}

export default function Logo({ showText = true, className = '' }: LogoProps) {
  return (
    <Link to="/" className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <rect x="12" y="3" width="8" height="26" rx="2" fill="#0284c7" />
        <rect x="2" y="10" width="28" height="5" rx="2" fill="#0ea5e9" />
        <rect x="2" y="17" width="28" height="5" rx="2" fill="#0ea5e9" />
        <rect x="14" y="3" width="4" height="26" rx="1" fill="#7dd3fc" />
      </svg>
      {showText && (
        <span className="text-xl font-bold tracking-tight text-primary-700">CoachKit</span>
      )}
    </Link>
  );
}
