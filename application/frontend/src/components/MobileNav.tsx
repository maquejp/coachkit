import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  links: { to: string; label: string }[];
}

export default function MobileNav({ open, onClose, links }: MobileNavProps) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 md:hidden">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-3/4 max-w-sm bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <Logo showText={false} />
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <nav className="flex flex-col gap-4">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={onClose}
              className="text-lg font-medium text-gray-700 hover:text-primary-600"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
