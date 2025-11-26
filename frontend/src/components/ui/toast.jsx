import React, { createContext, useCallback, useContext, useMemo, useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Info, AlertTriangle } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const toast = useCallback(({ title, description, variant = 'default', duration = 3500 }) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [
      ...t,
      { id, title, description, variant, createdAt: Date.now(), duration },
    ]);
    if (duration > 0) {
      setTimeout(() => remove(id), duration);
    }
    return id;
  }, [remove]);

  const value = useMemo(() => ({ toast, remove }), [toast, remove]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toaster toasts={toasts} onClose={remove} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

const variantStyles = {
  default: {
    container: 'border-border bg-card',
    icon: <CheckCircle2 className="w-5 h-5 text-primary" />,
    accent: 'bg-primary',
  },
  success: {
    container: 'border-green-200 bg-green-50',
    icon: <CheckCircle2 className="w-5 h-5 text-green-600" />,
    accent: 'bg-green-500',
  },
  destructive: {
    container: 'border-red-200 bg-red-50',
    icon: <XCircle className="w-5 h-5 text-red-600" />,
    accent: 'bg-red-500',
  },
  info: {
    container: 'border-blue-200 bg-blue-50',
    icon: <Info className="w-5 h-5 text-blue-600" />,
    accent: 'bg-blue-500',
  },
  warning: {
    container: 'border-amber-200 bg-amber-50',
    icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
    accent: 'bg-amber-500',
  },
};

function ToastItem({ t, onClose }) {
  const vs = variantStyles[t.variant] || variantStyles.default;
  const [enter, setEnter] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setEnter(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return (
    <div
      className={`relative overflow-hidden rounded-lg border shadow-lg p-3 sm:p-4 backdrop-blur-sm ${vs.container} transition-all duration-300 ${enter ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}
    >
      {/* Accent bar */}
      <div className={`absolute left-0 top-0 h-full w-1 ${vs.accent}`} />
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0">
          {vs.icon}
        </div>
        <div className="flex-1 min-w-0">
          {t.title && <div className="font-semibold leading-tight truncate">{t.title}</div>}
          {t.description && <div className="text-sm text-muted-foreground mt-0.5 break-words">{t.description}</div>}
        </div>
        <button
          className="rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
          onClick={() => onClose(t.id)}
          aria-label="Close"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export function Toaster({ toasts, onClose }) {
  return (
    <div className="fixed z-50 w-[92vw] max-w-sm right-4 top-4 sm:right-6 sm:top-6 flex flex-col gap-3">
      {toasts.map((t) => (
        <ToastItem key={t.id} t={t} onClose={onClose} />
      ))}
    </div>
  );
}
