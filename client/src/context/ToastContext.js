import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertTriangle, X, Info } from '../components/common/Icons';

const ToastContext = createContext(null);

let idSeq = 0;

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const push = useCallback((type, message, duration = 4000) => {
    const id = ++idSeq;
    setToasts(prev => [...prev, { id, type, message }]);
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
    return id;
  }, [removeToast]);

  const toast = {
    success: (message) => push('success', message),
    error: (message) => push('error', message, 6000),
    info: (message) => push('info', message),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toast-container" aria-live="polite">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type}`} role="status">
            <span className="toast-icon">
              {t.type === 'success' ? <CheckCircle size={18} /> : t.type === 'error' ? <AlertTriangle size={18} /> : <Info size={18} />}
            </span>
            <span className="toast-message">{t.message}</span>
            <button type="button" className="toast-close" onClick={() => removeToast(t.id)} aria-label="Close">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
};

export { ToastProvider, useToast };
