import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div style={{ position: 'fixed', bottom: 80, left: '50%', transform: 'translateX(-50%)', zIndex: 500, display: 'flex', flexDirection: 'column', gap: 8, pointerEvents: 'none' }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            background: t.type === 'success' ? '#00e676' : t.type === 'error' ? '#ff453a' : '#333',
            color: t.type === 'success' ? '#000' : '#fff',
            padding: '12px 24px', borderRadius: 24, fontWeight: 600,
            fontSize: '0.9rem', boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            animation: 'fadeInUp 0.3s ease',
            pointerEvents: 'auto',
          }}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
