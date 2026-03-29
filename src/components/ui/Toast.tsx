import React, { createContext, useContext, useState, useCallback } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../lib/utils";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  addToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.9, rotate: -2 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, x: 20, scale: 0.9, rotate: 2 }}
              layout
              className={cn(
                "pointer-events-auto flex items-center gap-4 px-5 py-4 rounded-2xl shadow-lg border min-w-[300px] max-w-md transform transition-all",
                toast.type === "success" && "bg-emerald-100 border-emerald-300 text-emerald-900 shadow-emerald-200/50",
                toast.type === "error" && "bg-rose-100 border-rose-300 text-rose-900 shadow-rose-200/50",
                toast.type === "info" && "bg-indigo-100 border-indigo-300 text-indigo-900 shadow-indigo-200/50"
              )}
            >
              <div className={cn(
                "p-2 rounded-xl border",
                toast.type === "success" && "bg-emerald-200 border-emerald-400 text-emerald-700",
                toast.type === "error" && "bg-rose-200 border-rose-400 text-rose-700",
                toast.type === "info" && "bg-indigo-200 border-indigo-400 text-indigo-700"
              )}>
                {toast.type === "success" && <CheckCircle className="w-6 h-6" />}
                {toast.type === "error" && <AlertCircle className="w-6 h-6" />}
                {toast.type === "info" && <Info className="w-6 h-6" />}
              </div>
              
              <p className="text-base font-black flex-1">{toast.message}</p>
              
              <button 
                onClick={() => removeToast(toast.id)}
                className={cn(
                  "p-2 rounded-xl transition-all border active:scale-95",
                  toast.type === "success" && "hover:bg-emerald-200 border-transparent hover:border-emerald-400 text-emerald-700",
                  toast.type === "error" && "hover:bg-rose-200 border-transparent hover:border-rose-400 text-rose-700",
                  toast.type === "info" && "hover:bg-indigo-200 border-transparent hover:border-indigo-400 text-indigo-700"
                )}
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
