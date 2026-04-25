import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { create } from 'zustand';

/**
 * Toast Store (Zustand) — internal; use `toast` helper to trigger.
 */
const useToastStore = create((set) => ({
  toasts: [],
  add: (toast) => set((s) => ({ toasts: [...s.toasts, { id: Date.now(), ...toast }] })),
  remove: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

/** Public API: call anywhere in the app */
export const toast = {
  success: (message, opts) => useToastStore.getState().add({ type: 'success', message, ...opts }),
  error: (message, opts) => useToastStore.getState().add({ type: 'error', message, ...opts }),
  warning: (message, opts) => useToastStore.getState().add({ type: 'warning', message, ...opts }),
  info: (message, opts) => useToastStore.getState().add({ type: 'info', message, ...opts }),
};

const icons = {
  success: <CheckCircle size={18} className="text-success" />,
  error: <XCircle size={18} className="text-error" />,
  warning: <AlertTriangle size={18} className="text-warning" />,
  info: <Info size={18} className="text-secondary" />,
};

const bgMap = {
  success: 'border-success/20 dark:border-green-500/20',
  error: 'border-error/20 dark:border-red-500/20',
  warning: 'border-warning/20 dark:border-yellow-500/20',
  info: 'border-secondary/20 dark:border-blue-500/20',
};

/** Single Toast item */
function ToastItem({ id, type, message, duration = 4000 }) {
  const remove = useToastStore((s) => s.remove);

  useEffect(() => {
    const timer = setTimeout(() => remove(id), duration);
    return () => clearTimeout(timer);
  }, [id, duration, remove]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={cn(
        'flex items-start gap-3 px-4 py-3 rounded-sq-md max-w-sm w-full',
        'bg-surface-container-lowest dark:bg-dark-surface-container-highest',
        'border shadow-card',
        bgMap[type],
      )}
    >
      <span className="mt-0.5 flex-shrink-0">{icons[type]}</span>
      <p className="flex-1 text-sm font-medium text-primary dark:text-dark-primary leading-snug">
        {message}
      </p>
      <button
        onClick={() => remove(id)}
        className="flex-shrink-0 text-on-surface-variant hover:text-primary dark:text-dark-on-surface-variant transition-colors"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
}

/** Toaster — render in App.jsx once */
export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 items-end">
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <ToastItem key={t.id} {...t} />
        ))}
      </AnimatePresence>
    </div>
  );
}
