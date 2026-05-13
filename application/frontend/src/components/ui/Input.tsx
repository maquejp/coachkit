import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className = '', ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`block w-full rounded-lg border px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 ${
          error
            ? 'border-red-300 focus:border-red-400 focus:ring-red-200'
            : 'border-gray-300 focus:border-primary-400 focus:ring-primary-200'
        } ${className}`}
        {...props}
      />
    );
  },
);

Input.displayName = 'Input';
