import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

export interface ToastMessage {
  id: string;
  type?: 'success' | 'info';
  title: string;
  description?: string;
  icon?: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  return (
    <div className="toast-portal-container" aria-live="polite" aria-atomic="true">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            className="toast-card"
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            onClick={onDismiss}
            role="alert"
          >
            <div className="toast-card__icon">
              <i className={`bx ${toast.icon || 'bx-check-circle'}`}></i>
            </div>
            <div className="toast-card__content">
              <span className="toast-card__title">{toast.title}</span>
              {toast.description && (
                <span className="toast-card__desc">{toast.description}</span>
              )}
            </div>
            <button
              type="button"
              className="toast-card__close"
              onClick={(e) => {
                e.stopPropagation();
                onDismiss();
              }}
              aria-label="Dismiss notification"
            >
              <i className="bx bx-x"></i>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
