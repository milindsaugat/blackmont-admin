import { useState, useEffect } from 'react';
import { Bell, Menu, Settings, LogOut } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { storage } from '../utils/storage';
import { pageStructure } from '../data/pageStructure';

export default function AdminHeader({ collapsed, onMobileMenuToggle, onLogout }) {
  const [showProfile, setShowProfile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const inquiries = storage.get('inquiries', []);
  const unreadCount = inquiries.filter(i => i.status === 'unread').length;

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && showProfile) setShowProfile(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [showProfile]);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path === '/inquiries') return 'Inquiries';
    if (path === '/clients') return 'Client Logins';
    if (path === '/settings') return 'Settings';
    const seg = path.split('/').filter(Boolean);
    if (seg[0] === 'pages' && seg[1]) return pageStructure[seg[1]]?.label || seg[1];
    return seg.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' / ');
  };

  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path === '/') return 'Admin / Dashboard';
    const seg = path.split('/').filter(Boolean);
    return ['Admin', ...seg.map(s => pageStructure[s]?.label || s.charAt(0).toUpperCase() + s.slice(1))].join(' / ');
  };

  return (
    <header
      style={{
        position: 'fixed', top: 0, right: 0, zIndex: 20,
        height: 'var(--header-h)',
        left: collapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-w)',
        background: 'rgba(8,8,8,0.92)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(212,175,55,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px', transition: 'left 300ms ease',
      }}
    >
      {/* Left */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Mobile hamburger */}
        <button
          onClick={onMobileMenuToggle}
          className="md:hidden"
          style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', padding: 4, display: 'none' }}
        >
          <Menu size={22} />
        </button>

        <div>
          <h1 className="typo-h1" style={{ lineHeight: 1 }}>{getPageTitle()}</h1>
          <p className="typo-caption" style={{ marginTop: 3 }}>{getBreadcrumb()}</p>
        </div>
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button
          style={{ position: 'relative', width: 36, height: 36, borderRadius: '50%', border: '1px solid #2a2a2a', background: 'transparent', color: '#666', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 200ms' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#444'; e.currentTarget.style.color = '#999'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = '#666'; }}
        >
          <Bell size={16} />
          {unreadCount > 0 && (
            <span className="animate-pulse-gold" style={{ position: 'absolute', top: 2, right: 2, width: 8, height: 8, borderRadius: '50%', background: '#D4AF37' }} />
          )}
        </button>

        <div style={{ width: 1, height: 24, background: '#222' }} />

        {/* Profile Card Container */}
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setShowProfile(!showProfile)}
            style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.05))', border: '1px solid rgba(212,175,55,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#D4AF37', fontFamily: 'var(--font-body)' }}>AD</span>
            </div>
            <span style={{ fontSize: 13, color: '#888', fontFamily: 'var(--font-body)' }}>Admin</span>
          </button>

          {/* Invisible Backdrop for Click-Outside */}
          {showProfile && (
            <div 
              onClick={() => setShowProfile(false)} 
              style={{ position: 'fixed', inset: 0, zIndex: 40 }} 
            />
          )}

          {/* Profile Dropdown */}
          <div 
            style={{ 
              position: 'fixed', 
              top: '60px', 
              right: '16px', 
              width: '220px', 
              background: '#0D0D0D', // Match sidebar
              border: '1px solid var(--border-default)', 
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              zIndex: 50,
              display: 'flex',
              flexDirection: 'column',
              opacity: showProfile ? 1 : 0,
              pointerEvents: showProfile ? 'auto' : 'none',
              transform: showProfile ? 'translateY(0)' : 'translateY(-10px)',
              transition: 'opacity 150ms ease, transform 150ms ease',
            }}
          >
            {/* Top section - User Info */}
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.05))', border: '1px solid var(--gold-30)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 18, fontWeight: 600, color: '#D4AF37', fontFamily: 'var(--font-body)' }}>AD</span>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p className="typo-h3" style={{ color: '#fff', margin: '0 0 4px 0', fontSize: '15px' }}>Admin</p>
                <p className="typo-small" style={{ color: 'var(--text-muted)', margin: 0 }}>Administrator</p>
              </div>
            </div>

            <div style={{ height: '1px', background: 'var(--border-default)' }} />

            {/* Middle section - Quick Links */}
            <div style={{ padding: '8px' }}>
              <button 
                onClick={() => { setShowProfile(false); navigate('/settings'); }}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', background: 'transparent', border: 'none', borderRadius: '8px', cursor: 'pointer', color: 'var(--text-primary)', fontSize: '13px', transition: 'background 200ms' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <Settings size={16} className="text-[var(--text-muted)]" />
                Settings
              </button>
            </div>

            <div style={{ height: '1px', background: 'var(--border-default)' }} />

            {/* Bottom section - Logout */}
            <div style={{ padding: '8px' }}>
              <button 
                onClick={() => { setShowProfile(false); if(onLogout) onLogout(); }}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', background: 'transparent', border: 'none', borderRadius: '8px', cursor: 'pointer', color: '#ef4444', fontSize: '13px', transition: 'background 200ms' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
