// src/context/ToastContext.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);
let _id = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'error', duration = 3500) => {
    const id = ++_id;
    setToasts((p) => [...p, { id, message, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), duration);
  }, []);

  const removeToast = useCallback((id) => setToasts((p) => p.filter((t) => t.id !== id)), []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div
        style={{
          position: 'fixed',
          bottom: 40,
          right: 40,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          zIndex: 10000,
        }}
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onRemove }) {
  const ok = toast.type === 'success';
  const warn = toast.type === 'warning';
  const border = ok ? '#a800ff' : warn ? '#ffcc00' : '#ff0055';
  const iconBg = ok ? '#a800ff' : warn ? '#ffcc00' : '#ff0055';
  const icon = ok ? '✓' : warn ? '!' : '✕';
  return (
    <div
      onClick={() => onRemove(toast.id)}
      style={{
        background: '#0d0d0d',
        color: '#fff',
        padding: '14px 20px',
        borderRadius: 12,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        boxShadow: `0 10px 40px rgba(0,0,0,.8), 0 0 15px ${border}44`,
        borderLeft: `4px solid ${border}`,
        animation: 'toastIn .35s cubic-bezier(.18,.89,.32,1.28)',
        cursor: 'pointer',
        minWidth: 280,
        maxWidth: 400,
      }}
    >
      <div
        style={{
          width: 24,
          height: 24,
          background: iconBg,
          color: warn ? '#000' : '#fff',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: 13,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <span style={{ fontSize: '0.88rem', lineHeight: 1.4 }}>{toast.message}</span>
      <style>{`@keyframes toastIn{from{transform:translateX(110%);opacity:0}to{transform:translateX(0);opacity:1}}`}</style>
    </div>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be inside ToastProvider');
  return ctx;
};
