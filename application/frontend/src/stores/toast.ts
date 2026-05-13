export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

export type ToastStore = {
  toasts: ToastItem[];
  add: (type: ToastType, message: string) => void;
  remove: (id: string) => void;
};

export const toastStore: ToastStore = { toasts: [], add: () => {}, remove: () => {} };

export function addToast(type: ToastType, message: string) {
  toastStore.add(type, message);
}
