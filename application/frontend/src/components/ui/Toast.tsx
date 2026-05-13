import { useEffect, useState } from 'react';
import { type ToastType, type ToastItem, toastStore } from '@/stores/toast';

const iconMap: Record<ToastType, string> = {
  success: 'M5 13l4 4L19 7',
  error: 'M6 18L18 6M6 6l12 12',
  info: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  warning: 'M12 9v4m0 4h.01M3 12a9 9 0 1118 0 9 9 0 01-18 0z',
};

const styleMap: Record<ToastType, string> = {
  success: 'border-l-4 border-green-500 bg-green-50 text-green-800',
  error: 'border-l-4 border-red-500 bg-red-50 text-red-800',
  info: 'border-l-4 border-primary-500 bg-primary-50 text-primary-800',
  warning: 'border-l-4 border-warm-500 bg-warm-50 text-warm-800',
};

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    toastStore.add = (type: ToastType, message: string) => {
      const id = String(Date.now());
      setToasts((prev) => [...prev, { id, type, message }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    };
    toastStore.remove = (id: string) => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm shadow-lg ${styleMap[t.type]}`}
        >
          <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={iconMap[t.type]}
            />
          </svg>
          <span className="flex-1">{t.message}</span>
          <button
            onClick={() => toastStore.remove(t.id)}
            className="ml-2 rounded p-0.5 hover:bg-black/5"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
