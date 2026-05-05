import { X, CheckCircle, AlertTriangle } from 'lucide-react';

export default function Toast({ toasts, onRemove }) {
  if (!toasts.length) return null;
  return (
    <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 100, display: 'flex', flexDirection: 'column', gap: 10 }}>
      {toasts.map(t => (
        <div key={t.id} className="animate-slide-up" style={{
          display: 'flex', alignItems: 'center', gap: 12, minWidth: 280, maxWidth: 400, padding: '12px 16px',
          background: 'rgba(17,17,17,0.95)', backdropFilter: 'blur(12px)',
          border: '1px solid var(--border-default)', borderLeft: `3px solid ${t.type === 'error' ? '#ff6b6b' : '#D4AF37'}`,
          borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}>
          {t.type === 'error' ? <AlertTriangle size={16} color="#ff6b6b" /> : <CheckCircle size={16} color="#D4AF37" />}
          <p className="typo-body" style={{ flex: 1 }}>{t.message}</p>
          <button onClick={() => onRemove(t.id)} style={{ color: '#444', background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}><X size={13} /></button>
        </div>
      ))}
    </div>
  );
}
