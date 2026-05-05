import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, maxWidth = '520px' }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={onClose}>
      <div className="animate-fade-in" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} />
      <div className="card animate-scale-in" style={{ position: 'relative', width: '100%', maxWidth, overflow: 'hidden', boxShadow: '0 24px 80px -16px rgba(0,0,0,0.6)' }} onClick={e => e.stopPropagation()}>
        <div className="card-header">
          <h3 className="typo-h2">{title}</h3>
          <button onClick={onClose} style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, color: '#555', background: 'transparent', border: 'none', cursor: 'pointer', transition: 'all 200ms' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#888'; e.currentTarget.style.background = 'var(--bg-hover)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#555'; e.currentTarget.style.background = 'transparent'; }}
          ><X size={16} /></button>
        </div>
        <div style={{ padding: '20px 24px' }}>{children}</div>
      </div>
    </div>,
    document.body
  );
}
