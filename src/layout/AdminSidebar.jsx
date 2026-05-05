import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Mail, Users, Settings, ChevronRight, LogOut, PanelLeftClose, PanelLeft, X, Shield, Pen, Plug } from 'lucide-react';
import { navStructure } from '../data/pageStructure';

const iconMap = { LayoutDashboard, FileText, Mail, Users, Settings, Shield, Link: Plug, Plug, Pen };

function useNewAppCount() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const check = () => {
      try {
        const raw = localStorage.getItem('bm_admin_applications');
        if (raw) { const apps = JSON.parse(raw); setCount(apps.filter(a => a.status === 'New').length); }
      } catch {}
    };
    check();
    const id = setInterval(check, 5000);
    return () => clearInterval(id);
  }, []);
  return count;
}

export default function AdminSidebar({ collapsed, onToggle, onLogout, mobileOpen, onMobileClose }) {
  const [expanded, setExpanded] = useState({});
  const loc = useLocation();
  const newAppCount = useNewAppCount();

  const toggle = (k) => setExpanded(p => ({ ...p, [k]: !p[k] }));
  const isActive = (item) => {
    if (item.path && loc.pathname === item.path) return true;
    if (item.children) return item.children.some(c => isActive(c));
    return false;
  };

  const renderItem = (item, depth = 0) => {
    const Icon = iconMap[item.icon];
    const hasKids = item.children?.length > 0;
    const open = expanded[item.key];
    const active = item.path && loc.pathname === item.path;
    const activeChild = hasKids && isActive(item);

    if (hasKids) {
      return (
        <div key={item.key}>
          <button
            onClick={() => toggle(item.key)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 14,
              height: 44, padding: '0 20px', fontSize: 13, border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-body)', fontWeight: 400,
              color: open || activeChild ? '#D4AF37' : '#777',
              background: open || activeChild ? 'rgba(212,175,55,0.06)' : 'transparent',
              transition: 'all 200ms',
            }}
            onMouseEnter={e => { if (!open && !activeChild) { e.currentTarget.style.color = '#D4AF37'; e.currentTarget.style.background = 'rgba(212,175,55,0.04)'; }}}
            onMouseLeave={e => { if (!open && !activeChild) { e.currentTarget.style.color = '#777'; e.currentTarget.style.background = 'transparent'; }}}
          >
            {Icon && <Icon size={18} style={{ flexShrink: 0 }} />}
            {!collapsed && <>
              <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
              <ChevronRight size={14} style={{ transition: 'transform 200ms', transform: open ? 'rotate(90deg)' : 'rotate(0)' }} />
            </>}
          </button>
          <div style={{ overflow: 'hidden', maxHeight: open && !collapsed ? 600 : 0, opacity: open && !collapsed ? 1 : 0, transition: 'all 300ms ease' }}>
            {item.children.map(c => renderItem(c, depth + 1))}
          </div>
        </div>
      );
    }

    return (
      <NavLink
        key={item.key}
        to={item.path}
        style={{
          display: 'flex', alignItems: 'center', gap: 14, height: 44, textDecoration: 'none',
          paddingLeft: depth > 0 ? 36 : 20, paddingRight: 20,
          fontSize: depth > 0 ? 12 : 13, fontFamily: 'var(--font-body)', fontWeight: 400,
          color: active ? '#D4AF37' : depth > 0 ? '#555' : '#777',
          background: active ? 'linear-gradient(90deg, rgba(212,175,55,0.12), transparent)' : 'transparent',
          borderLeft: active ? '2px solid #D4AF37' : '2px solid transparent',
          transition: 'all 200ms',
        }}
        onMouseEnter={e => { if (!active) { e.currentTarget.style.color = '#D4AF37'; e.currentTarget.style.background = 'rgba(212,175,55,0.04)'; }}}
        onMouseLeave={e => { if (!active) { e.currentTarget.style.color = depth > 0 ? '#555' : '#777'; e.currentTarget.style.background = 'transparent'; }}}
      >
        {Icon && <Icon size={18} style={{ flexShrink: 0 }} />}
        {!collapsed && (
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 8 }}>
            {item.label}
            {item.key === 'careers_apps' && newAppCount > 0 && (
              <span style={{ background: '#ef4444', color: '#fff', fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 8, lineHeight: '14px' }}>{newAppCount}</span>
            )}
          </span>
        )}
      </NavLink>
    );
  };

  const sidebarStyle = {
    position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 30,
    width: collapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-w)',
    background: '#0D0D0D', borderRight: '1px solid rgba(212,175,55,0.12)',
    display: 'flex', flexDirection: 'column', transition: 'width 300ms ease',
  };

  return (
    <aside style={sidebarStyle}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: collapsed ? '20px 16px' : '20px', justifyContent: collapsed ? 'center' : 'flex-start', flexShrink: 0 }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #D4AF37, #B8960C)', border: '2px solid #D4AF37', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ color: '#000', fontWeight: 700, fontSize: 14, fontFamily: 'var(--font-display)' }}>B</span>
        </div>
        {!collapsed && (
          <div className="animate-fade-in">
            <h1 style={{ fontSize: 14, fontWeight: 600, color: '#D4AF37', fontFamily: 'var(--font-display)', letterSpacing: '0.2em', lineHeight: 1 }}>BLACKMONT</h1>
            <p style={{ fontSize: 9, color: '#666', letterSpacing: '0.25em', marginTop: 5, fontWeight: 500 }}>ADMIN PORTAL</p>
          </div>
        )}

        {/* Mobile close */}
        {mobileOpen && (
          <button onClick={onMobileClose} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#555', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        )}
      </div>

      <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '0 16px' }} />

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
        {navStructure.map(item => renderItem(item))}
      </nav>

      {/* Bottom */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: 8, flexShrink: 0 }}>
        <button
          onClick={onToggle}
          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', height: 40, fontSize: 13, color: '#555', background: 'transparent', border: 'none', borderRadius: 8, cursor: 'pointer', transition: 'all 200ms' }}
          onMouseEnter={e => { e.currentTarget.style.color = '#888'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#555'; e.currentTarget.style.background = 'transparent'; }}
        >
          {collapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
          {!collapsed && <span>Collapse</span>}
        </button>
        <button
          onClick={onLogout}
          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', height: 40, fontSize: 13, color: '#555', background: 'transparent', border: 'none', borderRadius: 8, cursor: 'pointer', transition: 'all 200ms' }}
          onMouseEnter={e => { e.currentTarget.style.color = '#ff6b6b'; e.currentTarget.style.background = 'rgba(255,107,107,0.05)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#555'; e.currentTarget.style.background = 'transparent'; }}
        >
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
