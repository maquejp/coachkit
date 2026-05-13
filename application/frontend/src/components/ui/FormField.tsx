import { type ReactNode, cloneElement, isValidElement } from 'react';

interface FormFieldProps {
  label?: string;
  error?: string;
  helpText?: string;
  required?: boolean;
  children: ReactNode;
}

export function FormField({ label, error, helpText, required, children }: FormFieldProps) {
  const id = label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="ml-0.5 text-accent-500">*</span>}
        </label>
      )}

      {label && isValidElement(children)
        ? cloneElement(children, { id } as Record<string, string>)
        : children}

      {helpText && !error && <p className="text-xs text-gray-500">{helpText}</p>}

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
