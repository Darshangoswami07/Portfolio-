'use client';

import { useCallback, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

export type ToastVariant = 'success' | 'error' | 'info';

export interface ToastItem {
  id: number;
  message: string;
  variant: ToastVariant;
}

const variantMeta: Record<ToastVariant, { icon: typeof CheckCircle2; classes: string }> = {
  success: {
    icon: CheckCircle2,
    classes: 'border-green-500/30 text-green-600 dark:text-green-400',
  },
  error: {
    icon: XCircle,
    classes: 'border-red-500/30 text-red-600 dark:text-red-400',
  },
  info: {
    icon: Info,
    classes: 'border-orange-500/30 text-orange-600 dark:text-amber-400',
  },
};

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, variant: ToastVariant = 'info', duration = 3500) => {
      const id = ++idRef.current;
      setToasts((prev) => [...prev, { id, message, variant }]);
      window.setTimeout(() => dismissToast(id), duration);
    },
    [dismissToast]
  );

  return { toasts, showToast, dismissToast };
}

interface ToasterProps {
  toasts: ToastItem[];
  onDismiss: (id: number) => void;
}

export function Toaster({ toasts, onDismiss }: ToasterProps) {
  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2.5 w-[calc(100%-2.5rem)] max-w-sm pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const meta = variantMeta[toast.variant];
          const Icon = meta.icon;
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.95, transition: { duration: 0.2 } }}
              transition={{ type: 'spring', stiffness: 320, damping: 26 }}
              className={`glass-panel pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 shadow-xl ${meta.classes}`}
            >
              <Icon className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100 flex-1 leading-snug">
                {toast.message}
              </p>
              <button
                onClick={() => onDismiss(toast.id)}
                aria-label="Dismiss notification"
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
