import { useState, useEffect } from 'react';
import { X, Mail, Building2, Clock, Phone, CheckCircle, Trash2, MessageSquare, Quote, AlertTriangle } from 'lucide-react';

export default function InquiryDrawer({ inquiry, isOpen, onClose, onMarkRead, onMarkUnread, onDelete }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setShowDeleteModal(false);
      setShowToast(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen || !inquiry) return null;

  const formatDate = (d) => {
    const dt = new Date(d);
    return dt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) + ' at ' + dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const handleMarkRead = () => {
    if (onMarkRead) onMarkRead(inquiry._id);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleMarkUnread = () => {
    if (onMarkUnread) onMarkUnread(inquiry._id);
  };

  const handleDelete = () => {
    if (onDelete) onDelete(inquiry._id);
    setShowDeleteModal(false);
    onClose();
  };

  const initials = (inquiry.name || '').split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'BM';

  return (
    <>
      {/* Backdrop */}
      <div className="sidebar-overlay active animate-fade-in" onClick={onClose} 
           style={{ zIndex: 40, top: 'var(--header-h, 64px)', height: 'calc(100vh - var(--header-h, 64px))' }} />
      
      {/* Drawer */}
      <div className="fixed right-0 w-full sm:max-w-[420px] animate-slide-right flex flex-col shadow-2xl" 
        style={{ 
          top: 'var(--header-h, 64px)', 
          height: 'calc(100vh - var(--header-h, 64px))', 
          background: 'var(--bg-root)', 
          borderLeft: '1px solid var(--border-default)', 
          zIndex: 45 
        }}>
        
        {/* FIX 1: Header (fixed top) */}
        <div className="shrink-0 relative flex flex-col justify-center" 
             style={{ 
               padding: '40px 32px', 
               minHeight: '140px',
               borderBottom: '1px solid var(--border-default)', 
               background: 'var(--bg-surface)' 
             }}>
          
          {/* FIX 2: Close Button */}
          <button onClick={onClose} className="absolute top-4 right-4 flex items-center justify-center rounded-full transition-all" 
                  style={{ width: '32px', height: '32px', color: 'var(--text-muted)', background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
                  onMouseOver={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border-default)'; }}
                  title="Close (Esc)">
            <X size={16} />
          </button>

          <div className="flex items-center gap-4 w-full">
            <div className="rounded-full flex items-center justify-center font-bold shrink-0 shadow-inner" 
              style={{ width: '56px', height: '56px', fontSize: '20px', background: 'var(--gold-10)', border: '1px solid var(--gold-20)', color: 'var(--gold)' }}>
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="typo-display font-bold text-white truncate" style={{ fontSize: '24px', margin: '0 0 4px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {inquiry.name}
              </h2>
              <div className="flex items-center typo-small text-[var(--text-muted)] truncate" style={{ gap: '6px' }}>
                <Building2 size={12} className="shrink-0" />
                <span className="truncate" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {inquiry.company || 'Private Individual'}
                </span>
              </div>
            </div>
          </div>
          
          {/* ID Badge absolute positioned */}
          <div className="absolute bottom-4 right-4 typo-caption text-[var(--text-faint)]">
            ID: {inquiry._id.toString().slice(-8)}
          </div>
        </div>

        {/* FIX 4: Scrollable body */}
        <div className="flex-1 overflow-y-auto flex flex-col custom-scrollbar relative" 
             style={{ 
               padding: '32px', 
               gap: '32px' 
             }}>
          
          {/* Toast Notification */}
          {showToast && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-slide-up z-50"
                 style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)' }}>
              <CheckCircle size={14} className="text-green-500" />
              <span className="typo-small text-white font-medium">Marked as read</span>
            </div>
          )}

          {/* Contact Details */}
          <div className="flex flex-col" style={{ gap: '16px' }}>
            <div className="rounded-xl flex flex-col transition-base hover:border-[var(--border-strong)]" 
                 style={{ padding: '20px', gap: '12px', background: 'var(--bg-inset)', border: '1px solid var(--border-default)' }}>
              <div className="rounded-lg flex items-center justify-center shadow-sm" style={{ width: '32px', height: '32px', background: 'var(--bg-surface)', border: '1px solid var(--border-strong)', color: 'var(--text-muted)' }}>
                <Mail size={14} />
              </div>
              <div>
                <p className="typo-label" style={{ marginBottom: '4px' }}>Email Address</p>
                <p className="typo-body" style={{ color: 'var(--text-primary)', wordBreak: 'break-word', fontSize: '14px' }}>{inquiry.email}</p>
              </div>
            </div>
            
            <div className="rounded-xl flex flex-col transition-base hover:border-[var(--border-strong)]" 
                 style={{ padding: '20px', gap: '12px', background: 'var(--bg-inset)', border: '1px solid var(--border-default)' }}>
              <div className="rounded-lg flex items-center justify-center shadow-sm" style={{ width: '32px', height: '32px', background: 'var(--bg-surface)', border: '1px solid var(--border-strong)', color: 'var(--text-muted)' }}>
                <Phone size={14} />
              </div>
              <div>
                <p className="typo-label" style={{ marginBottom: '4px' }}>Phone Number</p>
                <p className="typo-body" style={{ color: inquiry.phone ? 'var(--text-primary)' : 'var(--text-muted)', fontStyle: inquiry.phone ? 'normal' : 'italic', fontSize: '14px' }}>
                  {inquiry.phone || 'Not provided'}
                </p>
              </div>
            </div>
            
            <div className="rounded-xl flex flex-col transition-base hover:border-[var(--border-strong)]" 
                 style={{ padding: '20px', gap: '12px', background: 'var(--bg-inset)', border: '1px solid var(--border-default)' }}>
              <div className="rounded-lg flex items-center justify-center shrink-0 shadow-sm" style={{ width: '32px', height: '32px', background: 'var(--bg-surface)', border: '1px solid var(--border-strong)', color: 'var(--text-muted)' }}>
                <Clock size={14} />
              </div>
              <div>
                <p className="typo-label" style={{ marginBottom: '4px' }}>Received Date</p>
                <p className="typo-body" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>{formatDate(inquiry.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Message Content */}
          <div className="flex flex-col" style={{ gap: '20px' }}>
            <div className="flex items-center" style={{ gap: '12px' }}>
              <MessageSquare size={16} style={{ color: 'var(--gold)' }} />
              <h4 className="typo-label" style={{ margin: 0 }}>Client Message</h4>
              <div className="flex-1" style={{ height: '1px', background: 'var(--border-subtle)' }} />
            </div>
            
            <div className="relative">
              <Quote size={40} className="absolute pointer-events-none" style={{ top: '-16px', left: '-8px', color: 'var(--gold)', opacity: 0.1 }} />
              <div className="leading-relaxed typo-body whitespace-pre-wrap relative z-10 shadow-lg" 
                style={{ 
                  padding: '24px',
                  background: 'var(--bg-surface)', 
                  border: '1px solid var(--border-default)', 
                  borderLeft: '3px solid var(--gold)',
                  borderRadius: '0 16px 16px 0',
                  color: '#e0e0e0',
                  fontSize: '15px'
                }}>
                {inquiry.message}
              </div>
            </div>
          </div>
        </div>

        {/* FIX 3: Action bar (fixed bottom) */}
        <div className="shrink-0 flex flex-col" style={{ borderTop: '1px solid var(--border-default)', background: 'var(--bg-surface)' }}>
          {/* Delete Confirmation Modal Overlay */}
          {showDeleteModal && (
            <div className="absolute bottom-full left-0 w-full p-4 animate-slide-up" style={{ background: 'var(--bg-surface)', borderTop: '1px solid #dc2626', zIndex: 10 }}>
              <div className="flex gap-3 mb-4 items-start">
                <AlertTriangle size={18} className="text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="typo-h3 text-white m-0 mb-1">Delete this inquiry?</p>
                  <p className="typo-small text-[var(--text-muted)] m-0">Permanently delete this inquiry? This cannot be undone.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowDeleteModal(false)} className="ghost-btn flex-1 justify-center py-2">Cancel</button>
                <button onClick={handleDelete} className="gold-btn flex-1 justify-center py-2 !text-white" style={{ background: '#dc2626', borderColor: '#dc2626', boxShadow: 'none' }}>
                  Yes, Delete
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between" style={{ padding: '20px 24px', gap: '12px' }}>
            {inquiry.status === 'unread' ? (
              <button onClick={handleMarkRead} className="gold-btn justify-center whitespace-nowrap" style={{ padding: '12px 20px', flex: 1 }}>
                <CheckCircle size={14} /> Mark as Read
              </button>
            ) : (
              <button onClick={handleMarkUnread} className="ghost-btn justify-center whitespace-nowrap" style={{ padding: '12px 20px', flex: 1 }}>
                <CheckCircle size={14} /> Mark Unread
              </button>
            )}
            <button onClick={() => setShowDeleteModal(true)} 
                    className="ghost-btn justify-center whitespace-nowrap" 
                    style={{ padding: '12px 20px', flex: 1, color: '#dc2626', borderColor: 'rgba(220, 38, 38, 0.3)' }}
                    onMouseOver={(e) => { e.currentTarget.style.borderColor = '#dc2626'; e.currentTarget.style.background = 'rgba(220, 38, 38, 0.05)'; }}
                    onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(220, 38, 38, 0.3)'; e.currentTarget.style.background = 'transparent'; }}>
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
