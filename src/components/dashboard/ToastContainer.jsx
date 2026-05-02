"use client";
import { useState, useEffect } from 'react';

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    function handleToast(e) {
      const id = Date.now();
      const { message, type } = e.detail;
      setToasts(prev => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 3500);
    }
    window.addEventListener('show-toast', handleToast);
    return () => window.removeEventListener('show-toast', handleToast);
  }, []);

  const colors = {
    success: { bg: '#d1fae5', border: '#34d399', text: '#065f46' },
    error:   { bg: '#fee2e2', border: '#f87171', text: '#991b1b' },
    info:    { bg: '#dbeafe', border: '#60a5fa', text: '#1e3a8a' },
  };

  const icons = { success: '✅', error: '❌', info: 'ℹ️' };

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    }}>
      {toasts.map(toast => {
        const c = colors[toast.type] || colors.info;
        return (
          <div key={toast.id} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 18px',
            borderRadius: '10px',
            background: c.bg,
            border: `1px solid ${c.border}`,
            color: c.text,
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            minWidth: '260px',
            maxWidth: '380px',
            animation: 'slideIn 0.2s ease',
          }}>
            <span>{icons[toast.type]}</span>
            <span>{toast.message}</span>
          </div>
        );
      })}
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}


